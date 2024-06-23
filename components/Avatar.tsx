import React from "react";
import styles from "./Avatar.module.css";
import rof_logo from "../app/ring_of_fire_favicon.png";

interface AvatarProps {
  id: string;
  type: string;
  text: string;
}
const Avatar: React.FC<AvatarProps> = ({ id, type, text }) => {
  let alt, src, onerror;

  if (type === "U") {
    alt = "User Avatar";
    src = `https://sleepercdn.com/avatars/${id}`;
  } else if (type === "L") {
    alt = "League Avatar";
    src = `https://sleepercdn.com/avatars/${id}`;
  } else if (type === "P") {
    alt = "Player Headshot";
    src = `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;
  }

  return (
    <div className={styles.avatar_container}>
      <img
        alt={alt}
        src={src}
        onError={(e) => (e.currentTarget.src = rof_logo.src)}
        className={styles.avatar}
      />
      <p className={styles.avatar_text}>{text}</p>
    </div>
  );
};

export default Avatar;
