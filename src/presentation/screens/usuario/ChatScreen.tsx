import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { ChatBubble } from '../../components/ChatBubble';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { styles } from '../../styles/ChatScreenStyles';

type Props = UsuarioStackScreenProps<'Chat'>;

const ChatsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contratacionId } = route.params;
  const { messages, isTyping, fetchMessages, sendMessage, markAsRead, updateTypingStatus, clearTypingStatus, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
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

    const msgText = message.trim();
    setMessage('');

    await sendMessage(user.id, { contratacionId, mensaje: msgText }, profile.nombreMostrar);

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
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Text style={styles.headerBackIcon}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Chat con Asesor</Text>

          {isOtherUserTyping && <Text style={styles.typingText}>escribiendo...</Text>}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* CHAT LISTA */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((msg) => (
            <ChatBubble
              key={msg.id}
              mensaje={msg}
              isMine={msg.remitenteId === user.id}
            />
          ))}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={handleTextChange}
            placeholder="Escribe un mensaje..."
            style={styles.messageInput}
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatsScreen;
