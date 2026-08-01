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
import { Button } from '../../components/Button';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const StudentRequestListScreen = () => {
  const { theme, currentUser, requests, navigate } = useApp();
  const colors = COLORS[theme];

  // Get user's own room requests
  const myRequests = requests.filter(r => r.roomId === currentUser.roomId);

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
      <Header title="Lịch Sử Yêu Cầu" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Floating action button simulation to add a new request */}
        <Button
          title="Tạo Yêu Cầu Sửa Chữa Mới"
          onPress={() => navigate('StudentAddRequest')}
          variant="primary"
          icon="➕"
          style={{ marginBottom: SPACING.md }}
        />

        {myRequests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🛠️</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa gửi yêu cầu nào</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Nếu phòng ở của bạn gặp bất cứ sự cố nào về điện, nước hay cơ sở vật chất, hãy gửi yêu cầu để kĩ thuật viên xử lý.
            </Text>
          </Card>
        ) : (
          myRequests.map(req => (
            <Card
              key={req.id}
              style={styles.requestCard}
              onPress={() => navigate('RequestDetail', { reqId: req.id })}
            >
              <View style={styles.requestHeader}>
                <View style={styles.categoryRow}>
                  <BadgeIcon
                    name={req.category === 'Điện' ? 'zap' : req.category === 'Nước' ? 'droplet' : 'settings'}
                    color={getStatusColor(req.status)}
                    size={36}
                  />
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryText, { color: colors.text }]}>
                      Phân loại: {req.category}
                    </Text>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      Gửi ngày: {req.createdAt}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(req.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
                    {req.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.requestTitle, { color: colors.text }]} numberOfLines={1}>
                {req.title}
              </Text>
              
              <Text style={[styles.requestDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                {req.description}
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.footerRow}>
                <View style={styles.priorityContainer}>
                  <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Độ ưu tiên: </Text>
                  <Text style={[styles.priorityText, { color: getPriorityColor(req.priority) }]}>
                    {req.priority}
                  </Text>
                </View>
                <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                  Chi tiết ➔
                </Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Tab Navigation simulation */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigate('StudentHome')}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigate('StudentRoom')}>
          <Text style={styles.tabIcon}>🔑</Text>
          <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>Phòng ở</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigate('StudentInvoiceList')}>
          <Text style={styles.tabIcon}>💵</Text>
          <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>Hóa đơn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigate('Profile')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, { color: colors.textSecondary }]}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
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
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: SIZES.fontXs,
    textAlign: 'center',
    lineHeight: 18,
  },
  requestCard: {
    marginVertical: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryInfo: {
    marginLeft: SPACING.sm,
  },
  categoryText: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: SIZES.fontXs,
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
  requestTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requestDesc: {
    fontSize: SIZES.fontXs,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: SIZES.fontXs,
  },
  priorityText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  viewDetailsText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 6,
    zIndex: 100,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});
