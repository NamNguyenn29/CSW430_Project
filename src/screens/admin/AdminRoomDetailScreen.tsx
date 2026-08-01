import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminRoomDetailScreen = () => {
  const { theme, screenParams, rooms, students, updateRoomMeter, deleteNode, goBack, navigate } = useApp();
  const colors = COLORS[theme];

  const { roomId } = screenParams;
  const room = rooms.find(r => r.id === roomId);

  const [waterIdx, setWaterIdx] = useState(room ? String(room.waterIndex) : '');
  const [elecIdx, setElecIdx] = useState(room ? String(room.electricityIndex) : '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!room) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Chi Tiết Phòng" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Không tìm thấy phòng này.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get student objects of this room
  const occupantsList = students.filter(s => s.roomId === room.id);

  const handleUpdateMeters = () => {
    const wNum = parseInt(waterIdx, 10);
    const eNum = parseInt(elecIdx, 10);

    if (isNaN(wNum) || isNaN(eNum)) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập chỉ số điện nước hợp lệ (dạng số nguyên).');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      updateRoomMeter(room.id, wNum, eNum);
      Alert.alert('Cập nhật thành công', `Đã cập nhật chỉ số điện nước mới cho phòng ${room.name}!`);
    }, 800);
  };

  const handleDeleteRoom = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa phòng ${room.name} không? Tất cả dữ liệu xếp phòng hiện tại sẽ bị xóa vĩnh viễn.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteNode(room.id);
              Alert.alert('Thành công', 'Đã xóa phòng thành công.');
              goBack();
            } catch (e: any) {
              Alert.alert('Thất bại', e.message || 'Không thể xóa phòng này.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn chỗ': return colors.success;
      case 'Đầy': return colors.primary;
      case 'Đang sửa chữa': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={`Phòng ${room.name}`} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Room Header Info */}
        <Card style={styles.headerCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.blockText}>{room.block}</Text>
              <Text style={[styles.title, { color: colors.text }]}>Phòng {room.name}</Text>
              <Text style={[styles.roomType, { color: colors.textSecondary }]}>Loại giường: {room.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(room.status)}15` }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(room.status) }]}>{room.status}</Text>
            </View>
          </View>
        </Card>

        {/* Room Occupants */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Thành viên phòng ({occupantsList.length})</Text>
        {occupantsList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Phòng trống, chưa có sinh viên ở.</Text>
          </Card>
        ) : (
          occupantsList.map(student => (
            <Card
              key={student.id}
              style={styles.studentCard}
              onPress={() => navigate('AdminStudentDetail', { studentId: student.id })}
            >
              <View style={styles.studentRow}>
                <Text style={styles.studentAvatar}>👤</Text>
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                  <Text style={[styles.studentSub, { color: colors.textSecondary }]}>
                    MSSV: {student.studentId} | Lớp: {student.class}
                  </Text>
                </View>
                <Text style={[styles.detailsLink, { color: colors.primary }]}>Hồ sơ ➔</Text>
              </View>
            </Card>
          ))
        )}

        {/* Update Meter Indices */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cập nhật chỉ số điện nước</Text>
        <Card style={styles.meterCard}>
          <View style={styles.meterInputsRow}>
            <View style={styles.inputWrapper}>
              <Input
                label="Chỉ số điện cũ: 1200"
                placeholder="Số điện mới"
                keyboardType="numeric"
                value={elecIdx}
                onChangeText={setElecIdx}
                icon="⚡"
              />
            </View>
            <View style={[styles.inputWrapper, { marginLeft: SPACING.md }]}>
              <Input
                label="Chỉ số nước cũ: 98"
                placeholder="Số nước mới"
                keyboardType="numeric"
                value={waterIdx}
                onChangeText={setWaterIdx}
                icon="💧"
              />
            </View>
          </View>
          <Button
            title="Cập nhật chỉ số"
            onPress={handleUpdateMeters}
            loading={isUpdating}
            variant="secondary"
            style={{ marginTop: SPACING.sm }}
          />
        </Card>

        {/* Create Invoice Action */}
        <Button
          title="Tạo hóa đơn cho phòng này"
          onPress={() => navigate('AdminAddInvoice', { preselectedRoomId: room.id })}
          variant="primary"
          icon="✍️"
          style={{ marginTop: SPACING.md }}
        />

        {/* Delete Room Action */}
        <Button
          title="Xóa phòng ở này"
          onPress={handleDeleteRoom}
          loading={isDeleting}
          variant="danger"
          icon="trash"
          style={{ marginTop: SPACING.xs, marginBottom: SPACING.xl }}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.fontMd,
  },
  headerCard: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockText: {
    color: '#6366F1',
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.fontXxl,
    fontWeight: 'bold',
    marginTop: 2,
  },
  roomType: {
    fontSize: SIZES.fontXs,
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyCard: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.fontXs,
  },
  studentCard: {
    marginVertical: 4,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
  },
  studentSub: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  detailsLink: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  meterCard: {
    padding: SPACING.md,
  },
  meterInputsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
  },
});
