import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { ChatBubble } from '../../components/ChatBubble';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, fontSize } from '../../styles/spacing';

type Props = AsesorStackScreenProps<'Chat'>;

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contratacionId } = route.params;
  const { messages, isTyping, fetchMessages, sendMessage, markAsRead, updateTypingStatus, clearTypingStatus, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { user, profile } = useAuthStore();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chatMessages = messages[contratacionId] || [];
  const isOtherUserTyping = isTyping[contratacionId] || false;

  useEffect(() => {
    if (!user || !profile) return;

    fetchMessages(contratacionId);
    subscribeToMessages(contratacionId, user.id, profile.nombreMostrar);
    markAsRead(contratacionId, user.id);

    return () => {
      if (user) clearTypingStatus(contratacionId, user.id);
      unsubscribeFromMessages(contratacionId);
    };
  }, [contratacionId, user]);

  const handleSend = async () => {
    if (!message.trim() || !user || !profile) return;

    const messageText = message.trim();
    setMessage('');

    await sendMessage(user.id, { contratacionId, mensaje: messageText }, profile.nombreMostrar);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    if (!user) return;

    updateTypingStatus(contratacionId, user.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (user) updateTypingStatus(contratacionId, user.id, false);
    }, 1000);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Chat con Cliente</Text>
          {isOtherUserTyping && (
            <Text style={styles.typingIndicator}>escribiendo...</Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.flex}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} mensaje={msg} isMine={msg.remitenteId === user.id} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={handleTextChange}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.gray[400]}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.lg,
  },
  backIcon: {
    fontSize: fontSize['2xl'],
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  typingIndicator: {
    fontSize: fontSize.sm,
    color: colors.green[600],
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray[900],
  },
  sendButton: {
    backgroundColor: colors.primary[600],
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: colors.white,
    fontSize: fontSize.xl,
  },
});

export default ChatScreen;