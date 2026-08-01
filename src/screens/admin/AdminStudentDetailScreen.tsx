import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminStudentDetailScreen = () => {
  const { theme, screenParams, students, rooms, assignRoom, toggleUser } = useApp();
  const colors = COLORS[theme];

  const { studentId } = screenParams;
  const student = students.find(s => s.id === studentId);

  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleToggleStatus = () => {
    const actionText = student?.status === 'Chờ duyệt' ? 'kích hoạt' : 'tạm khóa';
    Alert.alert(
      'Xác nhận thay đổi',
      `Bạn có chắc chắn muốn ${actionText} tài khoản của sinh viên ${student?.name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            if (!student) return;
            setIsAssigning(true);
            try {
              await toggleUser(student.id);
              Alert.alert('Thành công', `Đã ${actionText} tài khoản thành công!`);
            } catch (e) {
              Alert.alert('Thất bại', 'Không thể thay đổi trạng thái tài khoản.');
            } finally {
              setIsAssigning(false);
            }
          }
        }
      ]
    );
  };

  if (!student) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Hồ Sơ Sinh Viên" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Không tìm thấy thông tin sinh viên.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get available rooms for assignment
  const availableRooms = rooms.filter(r => r.status === 'Còn chỗ' && r.id !== student.roomId);

  const handleAssignRoom = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    Alert.alert(
      'Xác nhận xếp phòng',
      `Xếp sinh viên ${student.name} vào phòng ${targetRoom.name} (${targetRoom.block})?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () => {
            setIsAssigning(true);
            setTimeout(() => {
              setIsAssigning(false);
              assignRoom(student.id, roomId);
              Alert.alert('Thành công', `Đã xếp phòng ${targetRoom.name} cho sinh viên ${student.name}!`);
            }, 800);
          }
        }
      ]
    );
  };

  const handleRemoveRoom = () => {
    Alert.alert(
      'Hủy xếp phòng',
      `Bạn có chắc chắn muốn rút sinh viên ${student.name} ra khỏi phòng ${student.roomName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Rút phòng',
          onPress: () => {
            setIsAssigning(true);
            setTimeout(() => {
              setIsAssigning(false);
              assignRoom(student.id, '');
              Alert.alert('Thành công', `Đã rút phòng của sinh viên ${student.name}!`);
            }, 800);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang ở': return colors.success;
      case 'Chờ duyệt': return colors.warning;
      case 'Đã chuyển đi': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Hồ Sơ Sinh Viên" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Student Avatar Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <Text style={styles.profileAvatarEmoji}>🎓</Text>
            <View style={styles.profileMainInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{student.name}</Text>
              <Text style={[styles.profileSub, { color: colors.textSecondary }]}>
                MSSV: {student.studentId} | Lớp: {student.class}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(student.status)}15`, alignSelf: 'flex-start' }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor(student.status) }]}>{student.status}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Contact details */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Số điện thoại:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Giới tính:</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{student.gender}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Button
            title={student.status === 'Chờ duyệt' ? "Phê duyệt tài khoản (Approve)" : "Tạm khóa tài khoản (Deactivate)"}
            onPress={handleToggleStatus}
            loading={isAssigning}
            variant={student.status === 'Chờ duyệt' ? "primary" : "danger"}
            style={{ marginTop: SPACING.xs }}
          />
        </Card>

        {/* Room Assignment Management */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trạng thái phòng ở</Text>
        <Card style={styles.roomMgmtCard}>
          {student.roomId ? (
            <View>
              <View style={styles.roomAssignedRow}>
                <View>
                  <Text style={[styles.roomLabelText, { color: colors.textSecondary }]}>Đang lưu trú tại</Text>
                  <Text style={[styles.roomValueText, { color: colors.primary }]}>
                    Phòng {student.roomName} ({student.block})
                  </Text>
                  <Text style={[styles.contractText, { color: colors.textSecondary }]}>
                    Hợp đồng: {student.contractStart} - {student.contractEnd}
                  </Text>
                </View>
                <Text style={styles.homeEmoji}>🔑</Text>
              </View>
              <Button
                title="Hủy xếp phòng / Trả phòng"
                onPress={handleRemoveRoom}
                loading={isAssigning}
                variant="danger"
                style={{ marginTop: SPACING.md }}
              />
            </View>
          ) : (
            <View>
              <Text style={[styles.noRoomText, { color: colors.textSecondary }]}>
                Sinh viên này hiện tại chưa được xếp phòng ở.
              </Text>
              
              <Text style={[styles.selectLabel, { color: colors.text }]}>Chọn phòng trống để xếp:</Text>
              {availableRooms.length === 0 ? (
                <Text style={[styles.errorSelectText, { color: colors.danger }]}>
                  Không có phòng nào còn giường trống phù hợp.
                </Text>
              ) : (
                <View style={styles.roomsAssignGrid}>
                  {availableRooms.map(room => (
                    <TouchableOpacity
                      key={room.id}
                      style={[styles.roomOptionBtn, { borderColor: colors.border, backgroundColor: theme === 'light' ? '#F1F5F9' : '#1E293B' }]}
                      onPress={() => handleAssignRoom(room.id)}
                    >
                      <Text style={[styles.roomOptionText, { color: colors.text }]}>
                        {room.name} ({room.block})
                      </Text>
                      <Text style={[styles.roomOptionBedCount, { color: colors.primary }]}>
                        Còn {room.capacity - room.occupied} chỗ
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Violations Log */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhật ký vi phạm nội quy ({student.violations.length})</Text>
        <Card style={styles.violationsCard}>
          {student.violations.length === 0 ? (
            <Text style={[styles.noViolationText, { color: colors.success }]}>
              Sinh viên có lịch sử lưu trú tốt, không có vi phạm nào.
            </Text>
          ) : (
            student.violations.map((violation, index) => (
              <View key={index} style={styles.violationItem}>
                <Text style={styles.violationDot}>⚠️</Text>
                <Text style={[styles.violationText, { color: colors.text }]}>{violation}</Text>
              </View>
            ))
          )}
        </Card>
        
        {/* Extra spacing */}
        <View style={{ height: SPACING.xl }} />

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
  profileCard: {
    padding: SPACING.md,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarEmoji: {
    fontSize: 54,
    marginRight: SPACING.md,
  },
  profileMainInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
  },
  profileSub: {
    fontSize: SIZES.fontXs,
    marginVertical: 4,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: SIZES.fontSm,
  },
  infoVal: {
    fontSize: SIZES.fontSm,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  roomMgmtCard: {
    padding: SPACING.md,
  },
  roomAssignedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomLabelText: {
    fontSize: SIZES.fontXs,
  },
  roomValueText: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  contractText: {
    fontSize: SIZES.fontXs,
  },
  homeEmoji: {
    fontSize: 36,
  },
  noRoomText: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  selectLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  errorSelectText: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  roomsAssignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomOptionBtn: {
    width: '48%',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  roomOptionText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  roomOptionBedCount: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  violationsCard: {
    padding: SPACING.md,
  },
  noViolationText: {
    fontSize: SIZES.fontSm,
    textAlign: 'center',
  },
  violationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  violationDot: {
    fontSize: 14,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  violationText: {
    flex: 1,
    fontSize: SIZES.fontSm,
    lineHeight: 18,
  },
});
