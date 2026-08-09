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
import { Icon } from '../../components/Icon';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const RequestDetailScreen = () => {
  const { theme, language, screenParams, requests, currentRole, updateRequestStatus } = useApp();
  const colors = COLORS[theme];

  const { reqId } = screenParams;
  const request = requests.find(r => r.id === reqId);
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title={t('incidentDetail', language)} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{language === 'en' ? 'Request not found.' : 'Không tìm thấy thông tin yêu cầu.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdateStatus = (newStatus: 'Đang xử lý' | 'Đã giải quyết', note: string) => {
    Alert.alert(
      language === 'en' ? 'Confirm Update' : 'Xác nhận cập nhật',
      language === 'en' ? `Change incident status to "${newStatus}"?` : `Chuyển trạng thái yêu cầu sang "${newStatus}"?`,
      [
        { text: t('cancel', language), style: 'cancel' },
        {
          text: t('confirm', language),
          onPress: async () => {
            setIsProcessing(true);
            try {
              await updateRequestStatus(request.id, newStatus, note);
              Alert.alert(t('success', language), language === 'en' ? `Status updated to: ${newStatus}` : `Yêu cầu đã được chuyển sang trạng thái: ${newStatus}`);
            } catch (err: any) {
              Alert.alert(t('error', language), err || 'Không thể cập nhật trạng thái yêu cầu.');
            } finally {
              setIsProcessing(false);
            }
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

  const getStatusLabel = (status: string) => {
    if (language === 'en') {
      if (status === 'Đã giải quyết') return 'Resolved';
      if (status === 'Đang xử lý') return 'In Progress';
      if (status === 'Chờ xử lý') return 'Pending';
    }
    return status;
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
      <Header title={t('incidentDetail', language)} showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Ticket Basic details */}
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>{request.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(request.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>{getStatusLabel(request.status)}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{request.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Icon name="building" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {t('room', language)}: {formatRoomTitle(request.roomName, language)} ({request.block})
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon name="profile" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {t('reporter', language)}: {request.reporter}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon name="clock" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {t('reportTime', language)}: {request.createdAt}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Icon name="alert" size={14} color={getPriorityColor(request.priority)} style={{ marginRight: 6 }} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{t('priority', language)}: </Text>
              <Text style={[styles.priorityValue, { color: getPriorityColor(request.priority) }]}>
                {request.priority}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.descTitle, { color: colors.text }]}>{t('incidentDesc', language)}:</Text>
          <Text style={[styles.descBody, { color: colors.textSecondary }]}>{request.description}</Text>
        </Card>

        {/* Status updates log timeline */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('incidentLogs', language)}</Text>
        <Card style={styles.card}>
          {request.logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <View style={styles.timelineCol}>
                <View style={[styles.timelineDot, { backgroundColor: getStatusColor(log.status) }]} />
                {index < request.logs.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
              </View>
              <View style={styles.logContent}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logStatus, { color: getStatusColor(log.status) }]}>{getStatusLabel(log.status)}</Text>
                  <Text style={[styles.logTime, { color: colors.textSecondary }]}>{log.date}</Text>
                </View>
                <Text style={[styles.logNote, { color: colors.text }]}>{log.note}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Admin management actions */}
        {currentRole === 'manager' && (
          <View style={styles.adminSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('adminActions', language)}</Text>
            
            {request.status === 'Chờ xử lý' && (
              <Button
                title={t('processIncident', language)}
                onPress={() => handleUpdateStatus('Đang xử lý', 'Kỹ thuật viên đã nhận yêu cầu và đang tới phòng kiểm tra.')}
                loading={isProcessing}
                variant="primary"
                icon="settings"
                style={{ marginBottom: SPACING.xs }}
              />
            )}

            {request.status !== 'Đã giải quyết' && (
              <Button
                title={t('resolveIncident', language)}
                onPress={() => handleUpdateStatus('Đã giải quyết', 'Đã sửa chữa và kiểm tra vận hành hoàn tất.')}
                loading={isProcessing}
                variant="secondary"
                icon="check"
                style={{ marginBottom: SPACING.xs }}
              />
            )}
          </View>
        )}

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
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  metaContainer: {
    marginVertical: SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  metaText: {
    fontSize: SIZES.fontSm,
  },
  priorityValue: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  descTitle: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descBody: {
    fontSize: SIZES.fontSm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  logItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  logContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logStatus: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  logTime: {
    fontSize: SIZES.fontXs,
  },
  logNote: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
    lineHeight: 16,
  },
  adminSection: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
});
