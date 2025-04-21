import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import Avatar from '@/components/UI/Avatar';
import { Search } from 'lucide-react-native';
import { Message, Conversation, User } from '@/types';
import { fetchConversations } from '../../lib/supabaseApi';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const isWeb = Platform.OS === 'web';

type ConversationItemProps = {
  conversation: Conversation;
  otherUser: User;
  onPress: (conversation: Conversation) => void;
};

function ConversationItem({ conversation, otherUser, onPress }: ConversationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today, show time
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // Within a week, show day name
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Older, show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(conversation)}
      activeOpacity={0.7}
    >
      <Card style={[
        styles.conversationItem,
        conversation.unreadCount > 0 && { backgroundColor: `${colors.primary}10` },
      ]}>
        <Avatar
          source={otherUser.profileImage}
          name={otherUser.name}
          size={56}
          showBadge={otherUser.userType === 'worker'}
        />
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text 
              style={[
                styles.conversationName,
                { color: colors.text },
                conversation.unreadCount > 0 && { fontFamily: 'Inter-Bold' },
              ]}
              numberOfLines={1}
            >
              {otherUser.name}
            </Text>
            
            <Text style={[styles.conversationTime, { color: colors.placeholder }]}>
              {formatTime(conversation.lastMessage.createdAt)}
            </Text>
          </View>
          
          <View style={styles.conversationFooter}>
            <Text
              style={[
                styles.conversationMessage,
                { color: conversation.unreadCount > 0 ? colors.text : colors.placeholder },
                conversation.unreadCount > 0 && { fontFamily: 'Inter-SemiBold' },
              ]}
              numberOfLines={1}
            >
              {conversation.lastMessage.content}
            </Text>
            
            {conversation.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const currentUserId = user?.id;

  useEffect(() => {
    if (!currentUserId) return;
    const loadConversations = async () => {
      const { data, error } = await fetchConversations(currentUserId);
      if (data) setConversations(data);
      // TODO: Fetch user info for participants if needed
    };
    loadConversations();
    // Real-time subscription for conversations
    const channel = supabase.channel('conversations');
    let subscription: any;
    if (channel) {
      subscription = channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'conversations' },
          () => loadConversations()
        )
        .subscribe();
    }
    return () => {
      if (subscription && channel) channel.unsubscribe();
    };
  }, [currentUserId]);

  const getOtherUser = (conversation: Conversation): User => {
    // Assuming the first participant is the current user
    const otherParticipantId = conversation.participants[1];
    return users[otherParticipantId] || {
      id: otherParticipantId,
      name: 'Unknown User',
      email: '',
      phone: '',
      userType: 'worker',
      createdAt: new Date(),
    };
  };
  
  const handleConversationPress = (conversation: Conversation) => {
    // Navigate to ChatScreen with conversationId param
    router.push({ pathname: '/ChatScreen', params: { conversationId: conversation.id } });
  };

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.card }]}
        >
          <Search size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]} showsVerticalScrollIndicator={false}>
        {conversations.length > 0 ? (
          conversations.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              otherUser={getOtherUser(conversation)}
              onPress={handleConversationPress}
            />
          ))
        ) : (
          <Card style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No messages yet</Text>
            <Text style={[styles.emptyMessage, { color: colors.placeholder }]}>Start a conversation by contacting a worker or employer</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  containerDesktop: isWeb
    ? {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Only valid on web
        backgroundColor: '#f4f4f4',
      }
    : {},
  contentContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: 100,
  },
  contentContainerDesktop: isWeb
    ? {
        width: 480,
        minHeight: 600,
        maxHeight: '90vh', // Only valid on web
        borderRadius: 16,
        // @ts-ignore
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)', // Only valid on web
        margin: 32,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }
    : {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: Spacing.m,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: Spacing.s,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  conversationContent: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  conversationTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: Spacing.s,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  unreadCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: 'white',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});