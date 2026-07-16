import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TextInputProps,
  Animated,
  Easing,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = TextInputProps & {
  label: string;
  errorText?: string | null;
  hintText?: string | null;
  hintTone?: 'ok' | 'warn' | 'muted';
  rightSlot?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * FloatingInput — clean rectangular field with a thin dark border and a
 * quiet floating label. Focus subtly lifts the border to a soft violet.
 */
export function FloatingInput({
  label,
  value,
  onFocus,
  onBlur,
  errorText,
  hintText,
  hintTone = 'muted',
  secureTextEntry,
  rightSlot,
  containerStyle,
  testID,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: focused || (value && value.length > 0) ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [focused, value, anim]);

  const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [18, -8] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const hasError = !!errorText;
  const borderColor = hasError
    ? '#FF5A5F'
    : focused
      ? 'rgba(199, 125, 255, 0.55)'
      : 'rgba(255, 255, 255, 0.08)';
  const hintColor =
    hintTone === 'ok' ? '#00F5D4' : hintTone === 'warn' ? '#FF5A5F' : '#7A7A85';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[styles.field, { borderColor }]}>
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelSize,
              color: hasError ? '#FF5A5F' : focused ? '#C77DFF' : '#7A7A85',
            },
          ]}
        >
          {label}
        </Animated.Text>

        <View style={styles.inputRow}>
          <TextInput
            {...rest}
            value={value}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            secureTextEntry={secureTextEntry && !showSecret}
            placeholderTextColor="transparent"
            selectionColor="#C77DFF"
            style={styles.input}
            testID={testID}
          />
          {secureTextEntry ? (
            <Pressable
              onPress={() => setShowSecret((v) => !v)}
              hitSlop={8}
              testID={testID ? `${testID}-toggle-visibility` : undefined}
            >
              <Ionicons
                name={showSecret ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#7A7A85"
              />
            </Pressable>
          ) : null}
          {rightSlot}
        </View>
      </View>

      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : hintText ? (
        <Text style={[styles.hintText, { color: hintColor }]}>{hintText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  field: {
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#0A0A10',
    paddingHorizontal: 14,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 10,
    paddingHorizontal: 4,
    backgroundColor: '#05050A',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#F8F9FA',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 10,
    // @ts-expect-error web-only
    outlineStyle: 'none',
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    color: '#FF5A5F',
    fontSize: 12,
    fontWeight: '600',
  },
  hintText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
