import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminHomeScreen = () => {
  const { theme, students, rooms, invoices, requests, auditLogs, notificationLogs, addAnnouncement, navigate } = useApp();
  const colors = COLORS[theme];

  const formatAuditLog = (log: any) => {
    // Translate action
    let actionLabel = log.action || '';
    let actionColor = colors.primary;
    if (log.action === 'CREATE') {
      actionLabel = 'THÊM MỚI';
      actionColor = colors.success;
    } else if (log.action === 'UPDATE') {
      actionLabel = 'CẬP NHẬT';
      actionColor = colors.warning;
    } else if (log.action === 'DELETE') {
      actionLabel = 'XÓA BỎ';
      actionColor = colors.danger;
    } else if (log.action === 'READ') {
      actionLabel = 'TRUY XUẤT';
      actionColor = '#60A5FA';
    } else if (log.action === 'LOGIN') {
      actionLabel = 'ĐĂNG NHẬP';
      actionColor = '#818CF8';
    } else {
      actionLabel = actionLabel.toUpperCase();
    }

    // Translate entity type
    let entityLabel = log.entityType || '';
    if (log.entityType === 'AUTH') entityLabel = 'Tài khoản';
    else if (log.entityType === 'TICKET' || log.entityType === 'TICKETME' || log.entityType === 'TICKETADMIN') entityLabel = 'Sự cố';
    else if (log.entityType === 'TICKETCOMMENT') entityLabel = 'Bình luận sự cố';
    else if (log.entityType === 'TICKETATTACHMENT') entityLabel = 'Ảnh đính kèm';
    else if (log.entityType === 'INVOICE') entityLabel = 'Hóa đơn';
    else if (log.entityType === 'ROOMASSIGNMENT') entityLabel = 'Xếp phòng';
    else if (log.entityType === 'BUILDINGNODE') entityLabel = 'Sơ đồ phòng/tòa';
    else if (log.entityType === 'USER') entityLabel = 'Người dùng';
    else if (log.entityType === 'ANNOUNCEMENT') entityLabel = 'Thông báo';

    // Best-effort find user name who did the action
    let executor = 'Hệ thống / Guest';
    if (log.userFullName) {
      executor = log.userFullName;
    } else if (log.userId) {
      // Find in local students list
      const matched = students.find((s: any) => s.id === log.userId);
      if (matched) {
        executor = (matched as any).name || (matched as any).fullName;
      } else {
        executor = `Người dùng (ID: ${log.userId.substring(0, 8)}...)`;
      }
    }

    // Try parsing newValues/oldValues for rich details
    let details = '';
    try {
      if (log.newValues) {
        const newVal = JSON.parse(log.newValues);
        if (log.entityType === 'INVOICE') {
          details = `Lập hóa đơn ${newVal.month || ''} phòng ${newVal.roomName || ''} - ${newVal.amount ? newVal.amount.toLocaleString('vi-VN') + 'đ' : ''}`;
        } else if (log.entityType === 'ANNOUNCEMENT') {
          details = `Đăng thông báo: "${newVal.title || ''}"`;
        } else if (log.entityType === 'TICKET' || log.entityType === 'TICKETME' || log.entityType === 'TICKETADMIN') {
          details = `Sự cố: "${newVal.title || ''}" - Trạng thái: ${newVal.status || ''}`;
        } else if (log.entityType === 'ROOMASSIGNMENT') {
          details = `Gán sinh viên vào phòng ${newVal.roomName || ''}`;
        }
      } else if (log.oldValues) {
        const oldVal = JSON.parse(log.oldValues);
        if (log.entityType === 'USER' && log.action === 'UPDATE_PASSWORD') {
          details = `Đổi mật khẩu người dùng ${oldVal.fullName || oldVal.email || ''}`;
        }
      }
    } catch (e) {
      // Ignore json parsing issues
    }

    // Fallback details if empty
    if (!details) {
      details = `Thao tác trên đối tượng ${entityLabel} (ID: ${log.entityId ? log.entityId.substring(0, 8) + '...' : 'N/A'})`;
    }

    return {
      actionLabel,
      actionColor,
      entityLabel,
      executor,
      details,
      ipAddress: log.ipAddress || 'Unknown IP'
    };
  };

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important'>('normal');
  const [annAuthor, setAnnAuthor] = useState('Ban Quản Lý');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishAnnouncement = async () => {
    if (!annTitle.trim() || !annContent.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.');
      return;
    }
    setIsPublishing(true);
    try {
      await addAnnouncement(annTitle.trim(), annContent.trim(), annPriority, annAuthor.trim());
      Alert.alert('Thành công', 'Đã gửi/đăng tải thông báo mới thành công!');
      setShowPublishModal(false);
      setAnnTitle('');
      setAnnContent('');
      setAnnPriority('normal');
    } catch (e: any) {
      Alert.alert('Thất bại', e.message || 'Không thể đăng thông báo.');
    } finally {
      setIsPublishing(false);
    }
  };

  const totalStudents = students.filter(s => s.status === 'Đang ở').length;
  const pendingRegistrations = students.filter(s => s.status === 'Chờ duyệt').length;
  
  const totalCapacity = rooms.reduce((acc, curr) => acc + curr.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, curr) => acc + curr.occupied, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
  
  const pendingRequests = requests.filter(r => r.status === 'Chờ xử lý').length;
  const unpaidInvoicesCount = invoices.filter(i => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn').length;
  const totalUnpaidRevenue = invoices
    .filter(i => i.status === 'Chưa thanh toán' || i.status === 'Quá hạn')
    .reduce((acc, curr) => acc + curr.totalFee, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Quản Lý KTX" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Banner */}
        <Card style={styles.managerBanner}>
          <Text style={styles.bannerSubtitle}>Bảng điều khiển</Text>
          <Text style={styles.bannerTitle}>BAN QUẢN LÝ KÍ TÚC XÁ</Text>
          <Text style={styles.bannerInfo}>Hệ thống vận hành kĩ thuật & lưu trú sinh viên</Text>
        </Card>

        {/* Dynamic statistics layout */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Số liệu thống kê</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statsCard} onPress={() => navigate('AdminStudentList')}>
            <View style={{ alignItems: 'flex-start' }}>
              <BadgeIcon name="users" color="#2563EB" size={32} />
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Sinh viên lưu trú</Text>
              <Text style={[styles.statsValue, { color: colors.text }]}>{totalStudents} SV</Text>
              {pendingRegistrations > 0 ? (
                <View style={styles.badgeLabel}>
                  <Text style={styles.badgeLabelText}>+{pendingRegistrations} Chờ duyệt</Text>
                </View>
              ) : (
                <Text style={[styles.statsSubText, { color: colors.textSecondary }]}>Đã ổn định</Text>
              )}
            </View>
          </Card>

          <Card style={styles.statsCard} onPress={() => navigate('AdminRoomList')}>
            <View style={{ alignItems: 'flex-start' }}>
              <BadgeIcon name="room" color="#10B981" size={32} />
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Tỉ lệ lấp đầy</Text>
              <Text style={[styles.statsValue, { color: colors.text }]}>{occupancyRate}%</Text>
              <Text style={[styles.statsSubText, { color: colors.textSecondary }]}>
                {occupiedBeds}/{totalCapacity} giường
              </Text>
            </View>
          </Card>

          <Card style={styles.statsCard} onPress={() => navigate('AdminRequestList')}>
            <View style={{ alignItems: 'flex-start' }}>
              <BadgeIcon name="alert" color="#D97706" size={32} />
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Sự cố chờ xử lý</Text>
              <Text style={[styles.statsValue, { color: pendingRequests > 0 ? colors.danger : colors.success }]}>
                {pendingRequests} sự cố
              </Text>
              <Text style={[styles.statsSubText, { color: colors.textSecondary }]}>
                Cần phân công gấp
              </Text>
            </View>
          </Card>

          <Card style={styles.statsCard}>
            <View style={{ alignItems: 'flex-start' }}>
              <BadgeIcon name="invoice" color="#DC2626" size={32} />
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Tiền chưa thu</Text>
              <Text style={[styles.statsValue, { color: colors.danger }]} numberOfLines={1}>
                {Math.round(totalUnpaidRevenue / 1000000 * 10) / 10} Tr đ
              </Text>
              <Text style={[styles.statsSubText, { color: colors.textSecondary }]}>
                {unpaidInvoicesCount} hóa đơn
              </Text>
            </View>
          </Card>
        </View>

        {/* Administrative Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nghiệp vụ Quản lý</Text>
        <View style={styles.actionGrid}>
          <Card
            style={styles.actionBtn}
            onPress={() => navigate('AdminRoomList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="room" color="#2563EB" size={34} style={{ marginBottom: SPACING.xs }} />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Quản lý phòng</Text>
            </View>
          </Card>

          <Card
            style={styles.actionBtn}
            onPress={() => navigate('AdminStudentList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="users" color="#10B981" size={34} style={{ marginBottom: SPACING.xs }} />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Quản lý sinh viên</Text>
            </View>
          </Card>

          <Card
            style={styles.actionBtn}
            onPress={() => navigate('AdminRequestList')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="settings" color="#8B5CF6" size={34} style={{ marginBottom: SPACING.xs }} />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Quản lý sự cố</Text>
            </View>
          </Card>

          <Card
            style={styles.actionBtn}
            onPress={() => navigate('AdminAddInvoice')}
          >
            <View style={{ alignItems: 'center' }}>
              <BadgeIcon name="plus" color="#D97706" size={34} style={{ marginBottom: SPACING.xs }} />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Tạo hóa đơn mới</Text>
            </View>
          </Card>
        </View>

        {/* Publish Announcement Quick Button */}
        <Card
          style={[styles.publishCard, { backgroundColor: `${colors.primary}08`, borderColor: `${colors.primary}30` }]}
          onPress={() => setShowPublishModal(true)}
        >
          <View style={styles.publishCardRow}>
            <BadgeIcon name="bell" color={colors.primary} size={28} style={{ marginRight: SPACING.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.publishCardTitle, { color: colors.primary }]}>Đăng Bản Tin & Thông Báo</Text>
              <Text style={[styles.publishCardDesc, { color: colors.textSecondary }]}>
                Đăng tải thông báo KTX quan trọng gửi tới toàn thể sinh viên
              </Text>
            </View>
            <Icon name="plus" color={colors.primary} size={16} />
          </View>
        </Card>

        {/* Latest active requests */}
        <View style={styles.listHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Yêu cầu sửa chữa mới</Text>
          <Card style={{ paddingHorizontal: 10, paddingVertical: 4, marginVertical: 0 }} onPress={() => navigate('AdminRequestList')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Chi tiết</Text>
          </Card>
        </View>

        {requests.filter(r => r.status === 'Chờ xử lý').slice(0, 2).map(req => (
          <Card
            key={req.id}
            style={styles.reqCard}
            onPress={() => navigate('RequestDetail', { reqId: req.id })}
          >
            <View style={styles.reqHeader}>
              <View style={styles.reqBadgeRow}>
                <View style={[styles.priorityTag, { backgroundColor: req.priority === 'Cao' ? '#FEE2E2' : '#FEF3C7' }]}>
                  <Text style={[styles.priorityTagText, { color: req.priority === 'Cao' ? colors.danger : colors.warning }]}>
                    {req.priority}
                  </Text>
                </View>
                <Text style={[styles.reqRoomText, { color: colors.primary }]}>
                  Phòng {req.roomName} ({req.block})
                </Text>
              </View>
              <Text style={[styles.reqTime, { color: colors.textSecondary }]}>{req.createdAt}</Text>
            </View>
            <Text style={[styles.reqTitleText, { color: colors.text }]}>{req.title}</Text>
            <Text style={[styles.reqDescText, { color: colors.textSecondary }]} numberOfLines={1}>
              {req.description}
            </Text>
          </Card>
        ))}

        {/* Audit Logs Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhật ký hệ thống (Audit Logs)</Text>
        {auditLogs && auditLogs.length > 0 ? (
          auditLogs.slice(0, 4).map((log: any) => {
            const formatted = formatAuditLog(log);
            return (
              <Card key={log.id || Math.random().toString()} style={[styles.logCard, { borderLeftWidth: 3, borderLeftColor: formatted.actionColor }]}>
                <View style={styles.logHeader}>
                  <View style={[styles.actionBadge, { backgroundColor: `${formatted.actionColor}12`, borderColor: `${formatted.actionColor}30` }]}>
                    <Text style={[styles.actionBadgeText, { color: formatted.actionColor }]}>
                      {formatted.actionLabel}
                    </Text>
                  </View>
                  <Text style={[styles.logTime, { color: colors.textSecondary }]}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : 'Gần đây'}
                  </Text>
                </View>
                <Text style={[styles.logBodyText, { color: colors.text, fontWeight: '600', marginVertical: 6, fontSize: 13, lineHeight: 18 }]}>
                  {formatted.details}
                </Text>
                <View style={[styles.logDivider, { backgroundColor: colors.border, marginVertical: 4 }]} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '500' }}>
                    Thực hiện: <Text style={{ color: colors.text, fontWeight: 'bold' }}>{formatted.executor}</Text>
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.textSecondary, fontFamily: 'monospace' }}>
                    IP: {formatted.ipAddress}
                  </Text>
                </View>
              </Card>
            );
          })
        ) : (
          <Text style={[styles.emptyLogText, { color: colors.textSecondary }]}>Chưa có nhật ký hoạt động nào.</Text>
        )}

        {/* Notification Logs Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhật ký gửi thông báo (Notifications)</Text>
        {notificationLogs && notificationLogs.length > 0 ? (
          notificationLogs.slice(0, 4).map((noti: any) => (
            <Card key={noti.id || Math.random().toString()} style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={[styles.logRecipientText, { color: colors.text }]}>{noti.recipient}</Text>
                <View style={[styles.statusTag, { backgroundColor: noti.status === 'SUCCESS' ? `${colors.success}15` : `${colors.danger}15` }]}>
                  <Text style={[styles.statusTagText, { color: noti.status === 'SUCCESS' ? colors.success : colors.danger }]}>
                    {noti.status}
                  </Text>
                </View>
              </View>
              <Text style={[styles.logSubjectText, { color: colors.text, fontWeight: '600' }]}>{noti.subject}</Text>
              <Text style={[styles.logMessageText, { color: colors.textSecondary }]}>{noti.message}</Text>
              <Text style={[styles.logChannelText, { color: colors.primary }]}>Kênh: {noti.channel}</Text>
            </Card>
          ))
        ) : (
          <Text style={[styles.emptyLogText, { color: colors.textSecondary }]}>Chưa có nhật ký thông báo nào.</Text>
        )}

      </ScrollView>

      {/* Publish Announcement Modal */}
      <Modal
        visible={showPublishModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPublishModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitleText, { color: colors.text }]}>Đăng Thông Báo Mới</Text>
            
            <Input
              label="Tiêu đề thông báo"
              placeholder="Nhập tiêu đề thông báo"
              value={annTitle}
              onChangeText={setAnnTitle}
              icon="bell"
              containerStyle={{ marginVertical: SPACING.xs }}
            />

            <Input
              label="Nội dung chi tiết"
              placeholder="Nhập nội dung thông báo..."
              value={annContent}
              onChangeText={setAnnContent}
              multiline
              numberOfLines={4}
              containerStyle={{ marginVertical: SPACING.xs, height: 100 }}
            />

            <Input
              label="Người ký tên / Tác giả"
              placeholder="Ban Quản Lý KTX"
              value={annAuthor}
              onChangeText={setAnnAuthor}
              icon="profile"
              containerStyle={{ marginVertical: SPACING.xs }}
            />

            <Text style={[styles.modalLabel, { color: colors.textSecondary, marginVertical: 6 }]}>Mức độ quan trọng</Text>
            <View style={styles.prioritySelectorRow}>
              <TouchableOpacity
                style={[styles.priorityOpt, annPriority === 'normal' && { backgroundColor: colors.primary }]}
                onPress={() => setAnnPriority('normal')}
              >
                <Text style={[styles.priorityOptText, annPriority === 'normal' ? { color: '#FFF' } : { color: colors.text }]}>Thông thường</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priorityOpt, { marginLeft: SPACING.sm }, annPriority === 'important' && { backgroundColor: colors.danger }]}
                onPress={() => setAnnPriority('important')}
              >
                <Text style={[styles.priorityOptText, annPriority === 'important' ? { color: '#FFF' } : { color: colors.text }]}>Quan trọng ⚠️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Hủy"
                onPress={() => setShowPublishModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="Đăng Bản Tin"
                onPress={handlePublishAnnouncement}
                loading={isPublishing}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  managerBanner: {
    backgroundColor: '#0F172A',
    borderWidth: 0,
  },
  bannerSubtitle: {
    color: '#94A3B8',
    fontSize: SIZES.fontXs,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    marginTop: 2,
  },
  bannerInfo: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSm,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  statsLabel: {
    fontSize: SIZES.fontXs,
    marginTop: SPACING.xs,
  },
  statsValue: {
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    marginTop: 2,
  },
  statsSubText: {
    fontSize: SIZES.fontXs,
    marginTop: 4,
  },
  badgeLabel: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  badgeLabelText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '48%',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xs,
  },
  actionLabelText: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    textAlign: 'center',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  seeAllText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  reqCard: {
    marginVertical: SPACING.xs,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reqBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reqRoomText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  reqTime: {
    fontSize: SIZES.fontXs,
  },
  reqTitleText: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    marginTop: 2,
  },
  reqDescText: {
    fontSize: SIZES.fontSm,
    marginTop: 2,
  },
  logCard: {
    marginVertical: 4,
    padding: SPACING.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logActionText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  logTime: {
    fontSize: 10,
  },
  logBodyText: {
    fontSize: SIZES.fontXs,
  },
  logNotesText: {
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },
  logRecipientText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  logSubjectText: {
    fontSize: SIZES.fontXs,
  },
  logMessageText: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  logChannelText: {
    fontSize: 9,
    marginTop: 4,
  },
  emptyLogText: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  publishCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: SIZES.radiusLg,
  },
  publishCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishCardTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  publishCardDesc: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    padding: SPACING.lg,
    borderRadius: SIZES.radiusLg,
  },
  modalTitleText: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  modalLabel: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACING.md,
  },
  priorityOpt: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityOptText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
  },
  actionBadge: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logDivider: {
    height: 1,
    opacity: 0.5,
  },
});
