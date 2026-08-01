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
import { Header } from '../../components/Header';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const RequestDetailScreen = () => {
  const { theme, screenParams, requests, currentRole, updateRequestStatus } = useApp();
  const colors = COLORS[theme];

  const { reqId } = screenParams;
  const request = requests.find(r => r.id === reqId);
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Chi Tiết Sự Cố" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Không tìm thấy thông tin yêu cầu.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdateStatus = (newStatus: 'Đang xử lý' | 'Đã giải quyết', note: string) => {
    Alert.alert(
      'Xác nhận cập nhật',
      `Chuyển trạng thái yêu cầu sang "${newStatus}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setIsProcessing(true);
            setTimeout(() => {
              setIsProcessing(false);
              updateRequestStatus(request.id, newStatus, note);
              Alert.alert('Thành công', `Yêu cầu đã được chuyển sang trạng thái: ${newStatus}`);
            }, 800);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giải quyết': return colors.success;
      case 'Đang xử lý': return colors.primary;
      case 'Chờ xử lý': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao': return colors.danger;
      case 'Trung bình': return colors.warning;
      case 'Thấp': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Chi Tiết Sự Cố" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Ticket Basic details */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>{request.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>{request.status}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{request.title}</Text>
          
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              📍 Phòng: {request.roomName} ({request.block})
            </Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              👤 Người báo: {request.reporter}
            </Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              📅 Thời gian: {request.createdAt}
            </Text>
            <View style={styles.priorityRow}>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Độ ưu tiên: </Text>
              <Text style={[styles.priorityValue, { color: getPriorityColor(request.priority) }]}>
                {request.priority}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.descTitle, { color: colors.text }]}>Chi tiết sự cố:</Text>
          <Text style={[styles.descBody, { color: colors.textSecondary }]}>{request.description}</Text>
        </Card>

        {/* Status updates log timeline */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhật ký xử lý</Text>
        <Card style={styles.card}>
          {request.logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <View style={styles.timelineCol}>
                <View style={[styles.timelineDot, { backgroundColor: getStatusColor(log.status) }]} />
                {index < request.logs.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                )}
              </View>
              <View style={styles.logContent}>
                <View style={styles.logHeaderRow}>
                  <Text style={[styles.logStatus, { color: getStatusColor(log.status) }]}>{log.status}</Text>
                  <Text style={[styles.logDate, { color: colors.textSecondary }]}>{log.date}</Text>
                </View>
                <Text style={[styles.logNote, { color: colors.text }]}>{log.note}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Admin Operational Actions */}
        {currentRole === 'manager' && request.status !== 'Đã giải quyết' && (
          <View style={styles.adminActions}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Thao tác Quản lý</Text>
            {request.status === 'Chờ xử lý' && (
              <Button
                title="Tiến hành sửa chữa (Đang xử lý)"
                onPress={() => handleUpdateStatus('Đang xử lý', 'Đã cử kĩ thuật viên Trần Văn Nam đến kiểm tra.')}
                loading={isProcessing}
                variant="primary"
              />
            )}
            {request.status === 'Đang xử lý' && (
              <Button
                title="Hoàn thành sửa chữa (Đã giải quyết)"
                onPress={() => handleUpdateStatus('Đã giải quyết', 'Kĩ thuật viên đã thay mới linh kiện hỏng. Sự cố hoàn thành xử lý.')}
                loading={isProcessing}
                variant="secondary"
              />
            )}
          </View>
        )}

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
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginVertical: SPACING.sm,
  },
  metaRow: {
    marginTop: 4,
  },
  metaText: {
    fontSize: SIZES.fontXs,
    marginVertical: 2,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityValue: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  descTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descBody: {
    fontSize: SIZES.fontSm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  timelineCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  logContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  logHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logStatus: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  logDate: {
    fontSize: 10,
  },
  logNote: {
    fontSize: SIZES.fontXs,
    marginTop: 4,
    lineHeight: 16,
  },
  adminActions: {
    marginTop: SPACING.md,
  },
});
