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
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { BadgeIcon } from '../../components/BadgeIcon';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { COLORS, SIZES, SPACING } from '../../theme/theme';
import { t, formatRoomTitle } from '../../i18n/translations';

export const AdminRoomListScreen = () => {
  const { theme, language, rooms, createNode, navigate } = useApp();
  const colors = COLORS[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<'All' | 'Tòa A1' | 'Tòa A2' | 'Tòa B1'>('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('Floor 1');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert(t('error', language), language === 'en' ? 'Please enter room name.' : 'Vui lòng nhập tên phòng.');
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
      };

      await createNode(payload);
      Alert.alert(t('success', language), language === 'en' ? 'New room added successfully!' : 'Đã thêm phòng mới thành công!');
      setShowAddModal(false);
      setNewRoomName('');
    } catch (e: any) {
      Alert.alert(t('error', language), e.message || 'Không thể tạo phòng mới.');
    } finally {
      setIsAdding(false);
    }
  };

  const dynamicBlocks = Array.from(new Set(rooms.map(r => r.block).filter(Boolean)));
  const blocks = ['All', ...dynamicBlocks];

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        room.block.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBlock = selectedBlock === 'All' || room.block === selectedBlock;
    return matchSearch && matchBlock;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn chỗ':
        return colors.success;
      case 'Đầy':
        return colors.primary;
      case 'Bảo trì':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title={t('roomList', language)} showBack />
      
      {/* Search & Filter Header */}
      <View style={[styles.searchFilterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Input
          placeholder={t('searchRoomPlaceholder', language)}
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
                {block === 'All' ? (language === 'en' ? 'All Buildings' : 'Tất cả tòa') : block}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add New Room Button */}
      <Button
        title={t('addRoom', language)}
        onPress={() => setShowAddModal(true)}
        variant="primary"
        icon="plus"
        style={{ marginHorizontal: SPACING.md, marginTop: SPACING.sm }}
      />

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.listHeaderTitle, { color: colors.text }]}>
          {language === 'en' ? `Room List (${filteredRooms.length})` : `Danh sách phòng (${filteredRooms.length})`}
        </Text>
        
        {filteredRooms.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Icon name="inbox" size={44} color={colors.textSecondary} style={{ marginBottom: SPACING.md }} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{language === 'en' ? 'No matching rooms found' : 'Không tìm thấy phòng phù hợp'}</Text>
          </Card>
        ) : (
          filteredRooms.map(room => (
            <Card
              key={room.id}
              style={styles.roomCard}
              onPress={() => navigate('AdminRoomDetail', { roomId: room.id })}
            >
              <View style={styles.roomRow}>
                <BadgeIcon name="room" color={colors.primary} size={36} />
                <View style={styles.roomInfo}>
                  <Text style={[styles.roomTitle, { color: colors.text }]}>
                    {formatRoomTitle(room.name, language)} {room.block ? `(${room.block})` : ''}
                  </Text>
                  <Text style={[styles.roomSub, { color: colors.textSecondary }]}>
                    {room.floor ? `${room.floor} • ` : ''}{t('members', language)}: {room.occupied} / {room.capacity}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(room.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(room.status) }]}>
                    {room.status}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add Room Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('addRoom', language)}</Text>
            
            <Input
              label={language === 'en' ? 'Room Name (e.g. Room 304)' : 'Tên phòng (Ví dụ: Phòng 304)'}
              placeholder="Phòng 304"
              value={newRoomName}
              onChangeText={setNewRoomName}
              icon="room"
            />

            <Text style={[styles.floorSelectLabel, { color: colors.textSecondary }]}>{language === 'en' ? 'Select Floor' : 'Chọn Tầng / Vị trí'}</Text>
            <View style={styles.floorSelectorRow}>
              {['Floor 1', 'Floor 2'].map(fl => (
                <TouchableOpacity
                  key={fl}
                  style={[
                    styles.floorOption,
                    { borderColor: colors.border },
                    selectedFloor === fl && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedFloor(fl)}
                >
                  <Text style={[styles.floorOptionText, selectedFloor === fl ? { color: '#FFF' } : { color: colors.text }]}>
                    {fl === 'Floor 1' ? (language === 'en' ? 'Floor 1 (Building A1)' : 'Tầng 1 (Tòa A1)') : (language === 'en' ? 'Floor 2 (Building A1)' : 'Tầng 2 (Tòa A1)')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title={t('cancel', language)}
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title={t('save', language)}
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
  },
  chipScrollView: {
    flexDirection: 'row',
    marginVertical: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  roomCard: {
    marginVertical: 4,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  roomTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
  roomSub: {
    fontSize: SIZES.fontXs,
    marginTop: 2,
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
  },
  modalTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  floorSelectLabel: {
    fontSize: SIZES.fontXs,
    fontWeight: '600',
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  floorSelectorRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  floorOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  floorOptionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
