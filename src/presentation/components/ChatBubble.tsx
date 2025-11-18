import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MensajeChat } from '@domain/entities';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface ChatBubbleProps {
  mensaje: MensajeChat;
  isMine: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ mensaje, isMine }) => {
  return (
    <View style={[styles.container, isMine ? styles.containerMine : styles.containerOther]}>
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleOther,
        ]}
      >
        {!isMine && mensaje.remitente && (
          <Text style={styles.senderName}>
            {mensaje.remitente.nombreMostrar}
          </Text>
        )}
        
        <Text style={[styles.message, isMine ? styles.messageMine : styles.messageOther]}>
          {mensaje.mensaje}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.time, isMine ? styles.timeMine : styles.timeOther]}>
            {mensaje.horaFormateada}
          </Text>
          
          {isMine && (
            <Text style={styles.checkmark}>
              {mensaje.leido ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    flexDirection: 'row',
  },
  containerMine: {
    justifyContent: 'flex-end',
  },
  containerOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleMine: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.gray[200],
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.base,
  },
  messageMine: {
    color: colors.white,
  },
  messageOther: {
    color: colors.gray[900],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  time: {
    fontSize: fontSize.xs,
  },
  timeMine: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOther: {
    color: colors.gray[500],
  },
  checkmark: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: spacing.xs,
  },
});