import React from "react";

interface GoogleIconProps {
  className?: string;
}

const GoogleIcon = ({ className }: GoogleIconProps) => (
  <img
    src="https://img.icons8.com/color/1200/google-logo.jpg"
    alt="Google Icon"
    className={className}
  />
);

export default GoogleIcon;
