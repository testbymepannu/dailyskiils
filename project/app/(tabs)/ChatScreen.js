import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchMessages, sendMessage } from '../../lib/supabaseApi';
import { useAuth } from '../../contexts/AuthContext';

const isWeb = Platform.OS === 'web';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    const { data, error } = await fetchMessages(conversationId);
    if (data) setMessages(data);
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
    // Subscribe to real-time updates
    const channel = fetchMessages.supabase
      ? fetchMessages.supabase.channel('messages')
      : null;
    let subscription;
    if (channel && conversationId) {
      subscription = channel
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
          () => loadMessages()
        )
        .subscribe();
    }
    return () => {
      if (subscription && channel) channel.unsubscribe();
    };
  }, [loadMessages, conversationId]);

  const handleSend = async () => {
    if (input.trim() === '' || !conversationId || !currentUserId) return;
    const { data, error } = await sendMessage({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: input,
    });
    if (!error) {
      setInput('');
      // loadMessages(); // Real-time will update automatically
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, isDesktop && styles.containerDesktop]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.chatBox, isDesktop && styles.chatBoxDesktop]}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, item.sender_id === currentUserId ? styles.myMessage : styles.theirMessage]}>
              <Text style={styles.messageText}>{item.content}</Text>
              <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
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
  chatBox: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatBoxDesktop: isWeb
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
        overflow: 'hidden',
      }
    : {},
  messagesList: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#F1F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
});
