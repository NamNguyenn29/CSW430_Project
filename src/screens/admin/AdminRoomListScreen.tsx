import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { COLORS, SIZES, SPACING } from '../../theme/theme';

export const AdminRoomListScreen = () => {
  const { theme, rooms, createNode, navigate } = useApp();
  const colors = COLORS[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<'All' | 'Tòa A1' | 'Tòa A2' | 'Tòa B1'>('All');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<'All' | 'Còn chỗ' | 'Đã đầy' | 'Bảo trì'>('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('Floor 1');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên phòng.');
      return;
    }
    setIsAdding(true);
    try {
      const parentId = selectedFloor === 'Floor 1' 
        ? 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
        : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02';
      
      const payload = {
        name: newRoomName.trim(),
        description: `Mô tả phòng ${newRoomName.trim()}`,
        maxCapacity: 4,
        nodeTypeId: '44444444-4444-4444-4444-444444444444',
        parentId,
        status: 'ENABLE',
      };
      
      await createNode(payload);
      Alert.alert('Thành công', `Đã thêm phòng ${newRoomName.trim()} thành công!`);
      setShowAddModal(false);
      setNewRoomName('');
    } catch (e: any) {
      Alert.alert('Thất bại', e.message || 'Không thể thêm phòng mới.');
    } finally {
      setIsAdding(false);
    }
  };

  const blocks = ['All', 'Tòa A1', 'Tòa A2', 'Tòa B1'];
  const statuses = ['All', 'Còn chỗ', 'Đã đầy', 'Bảo trì'];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || room.block === selectedBlock;
    const matchesStatus = selectedFilterStatus === 'All' || room.status === selectedFilterStatus;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn chỗ':
        return colors.success;
      case 'Đã đầy':
        return colors.danger;
      case 'Bảo trì':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Quản Lý Phòng KTX" />
      
      {/* Search & Filter Header */}
      <View style={[styles.searchFilterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Input
          placeholder="Tìm theo tên phòng, tòa nhà..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
          containerStyle={{ marginBottom: SPACING.xs }}
        />

        {/* Block Horizontal Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
          {blocks.map(block => (
            <TouchableOpacity
              key={block}
              style={[
                styles.filterChip,
                { borderColor: colors.border, backgroundColor: colors.background },
                selectedBlock === block && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedBlock(block as any)}
            >
              <Text style={[
                styles.filterChipText,
                { color: colors.text },
                selectedBlock === block && { color: '#FFFFFF' }
              ]}>
                {block === 'All' ? 'Tất cả tòa' : block}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add New Room Button */}
      <Button
        title="Thêm Phòng Ở Mới"
        onPress={() => setShowAddModal(true)}
        variant="primary"
        icon="➕"
        style={{ marginHorizontal: SPACING.md, marginTop: SPACING.sm }}
      />

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listHeaderTitle, { color: colors.text }]}>
          Danh sách phòng ({filteredRooms.length})
        </Text>
        
        {filteredRooms.length === 0 ? (
          <Card style={styles.emptyCard}>
            <BadgeIcon name="room" color={colors.textSecondary} size={44} style={{ marginBottom: SPACING.md }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Không tìm thấy phòng phù hợp</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Vui lòng thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </Text>
          </Card>
        ) : (
          filteredRooms.map(room => (
            <Card
              key={room.id}
              style={styles.roomCard}
              onPress={() => navigate('AdminRoomDetail', { roomId: room.id })}
            >
              <View style={styles.roomRow}>
                <View style={styles.roomInfo}>
                  <Text style={[styles.roomNameText, { color: colors.text }]}>{room.name}</Text>
                  <Text style={[styles.roomSubText, { color: colors.textSecondary }]}>
                    {room.block} | Loại: {room.type}
                  </Text>
                  <Text style={[styles.roomPriceText, { color: colors.primary }]}>
                    {room.price.toLocaleString('vi-VN')} đ/tháng
                  </Text>
                </View>

                <View style={styles.rightInfo}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(room.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(room.status) }]}>
                      {room.status}
                    </Text>
                  </View>
                  <View style={styles.occupantRow}>
                    <Icon name="users" color={colors.textSecondary} size={13} style={{ marginRight: 4 }} />
                    <Text style={[styles.occupantText, { color: colors.text }]}>
                      {room.occupied} / {room.capacity}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add Room Modal */}
      <Modal
        visible={showAddModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Thêm Phòng Ở Mới</Text>
            
            <Input
              label="Tên phòng (Ví dụ: P.104)"
              placeholder="Nhập tên phòng"
              value={newRoomName}
              onChangeText={setNewRoomName}
              icon="room"
              containerStyle={{ marginVertical: SPACING.sm }}
            />

            <Text style={[styles.label, { color: colors.textSecondary, marginBottom: 4 }]}>Chọn Tầng / Tòa nhà</Text>
            <View style={styles.floorSelectorContainer}>
              <TouchableOpacity
                style={[styles.floorOption, selectedFloor === 'Floor 1' && { backgroundColor: colors.primary }]}
                onPress={() => setSelectedFloor('Floor 1')}
              >
                <Text style={[styles.floorText, selectedFloor === 'Floor 1' ? { color: '#FFF' } : { color: colors.text }]}>Tầng 1 (Tòa A1)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.floorOption, { marginLeft: SPACING.sm }, selectedFloor === 'Floor 2' && { backgroundColor: colors.primary }]}
                onPress={() => setSelectedFloor('Floor 2')}
              >
                <Text style={[styles.floorText, selectedFloor === 'Floor 2' ? { color: '#FFF' } : { color: colors.text }]}>Tầng 2 (Tòa A1)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActionRow}>
              <Button
                title="Hủy"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="Thêm mới"
                onPress={handleAddRoom}
                loading={isAdding}
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
  searchFilterContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  chipScrollView: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    marginRight: SPACING.xs,
  },
  filterChipText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  listHeaderTitle: {
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
  roomCard: {
    marginBottom: SPACING.xs,
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 1,
  },
  roomNameText: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
  },
  roomSubText: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  roomPriceText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    marginTop: 4,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
    marginBottom: 6,
  },
  statusText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
  },
  occupantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occupantText: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
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
  modalTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  floorSelectorContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACING.md,
  },
  floorOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorText: {
    fontSize: SIZES.fontXs,
    fontWeight: 'bold',
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
