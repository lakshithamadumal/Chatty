import React, { useMemo, useState } from "react";
import { Image, Text, View } from "react-native";

type InitialsAvatarProps = {
  name: string;
  uri?: string | null;
  size?: number; // defaults to 48
  className?: string;
};

function getInitialsFromName(name: string): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first}${last}`;
}

function stringToColorIndex(input: string, modulo: number): number {
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = (hash << 5) - hash + input.charCodeAt(i);
    // tslint:disable-next-line: no-bitwise
    hash |= 0;
  }
  const idx = Math.abs(hash) % modulo;
  return idx;
}

const PALETTE = [
  "#4A61D1",
  "#6B82FF",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F43F5E",
  "#6366F1",
  "#0EA5E9",
];

export default function InitialsAvatar({ name, uri, size = 48, className }: InitialsAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => getInitialsFromName(name), [name]);
  const backgroundColor = useMemo(
    () => PALETTE[stringToColorIndex(name || "?", PALETTE.length)],
    [name]
  );
  const fontSize = Math.max(12, Math.round(size * 0.42));

  if (uri && !imageFailed) {
    return (
      <Image
        source={{ uri }}
        className={`rounded-full ${className ?? ""}`.trim()}
        style={{ width: size, height: size }}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <View
      className={`items-center justify-center rounded-full ${className ?? ""}`.trim()}
      style={{ width: size, height: size, backgroundColor }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize }}>{initials}</Text>
    </View>
  );
}



