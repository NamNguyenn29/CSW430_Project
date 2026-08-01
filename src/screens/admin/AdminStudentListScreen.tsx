import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminStudentListScreen = () => {
  const { theme, students, navigate } = useApp();
  const colors = COLORS[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Đang ở' | 'Chờ duyệt' | 'Đã rời KTX'>('All');

  const statuses = ['All', 'Đang ở', 'Chờ duyệt', 'Đã rời KTX'];

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roomName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatusFilter === 'All' || student.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang ở':
        return colors.success;
      case 'Chờ duyệt':
        return colors.warning;
      case 'Đã rời KTX':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Quản Lý Sinh Viên" />

      {/* Search Bar & Status Filters */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Input
          placeholder="Tìm theo tên SV, MSSV, Phòng..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
          containerStyle={{ marginBottom: SPACING.xs }}
        />

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScrollView}>
          {statuses.map(st => (
            <TouchableOpacity
              key={st}
              style={[
                styles.filterPill,
                { borderColor: colors.border, backgroundColor: colors.background },
                selectedStatusFilter === st && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedStatusFilter(st as any)}
            >
              <Text style={[
                styles.filterPillText,
                { color: colors.text },
                selectedStatusFilter === st && { color: '#FFFFFF' }
              ]}>
                {st === 'All' ? 'Tất cả trạng thái' : st}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Student List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          Danh sách sinh viên ({filteredStudents.length})
        </Text>

        {filteredStudents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <BadgeIcon name="users" color={colors.textSecondary} size={44} style={{ marginBottom: SPACING.md }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không tìm thấy sinh viên</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc thay đổi bộ lọc trạng thái.
            </Text>
          </Card>
        ) : (
          filteredStudents.map(student => (
            <Card
              key={student.id}
              style={styles.studentCard}
              onPress={() => navigate('AdminStudentDetail', { studentId: student.id })}
            >
              <View style={styles.studentRow}>
                <BadgeIcon name="profile" color={colors.primary} size={36} />
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                  <Text style={[styles.studentSub, { color: colors.textSecondary }]}>
                    MSSV: {student.studentId} | Lớp: {student.class}
                  </Text>
                  <Text style={[styles.roomLabel, { color: colors.primary }]}>
                    Phòng: {student.roomName} {student.block ? `(${student.block})` : ''}
                  </Text>
                </View>
                <View style={styles.rightColumn}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(student.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(student.status) }]}>
                      {student.status}
                    </Text>
                  </View>
                  <Icon name="back" color={colors.primary} size={16} style={{ transform: [{ rotate: '180deg' }], marginTop: 6 }} />
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  pillScrollView: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    marginRight: SPACING.xs,
  },
  filterPillText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  listTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.md,
  },
  emptyTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  emptyDesc: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
  },
  studentCard: {
    marginBottom: SPACING.xs,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  studentName: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
  },
  studentSub: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  roomLabel: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    marginTop: 4,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
});
