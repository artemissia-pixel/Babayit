import React from 'react';
import { I18nManager } from 'react-native';
import './src/i18n';
import { MapScreen } from './src/screens/MapScreen';

I18nManager.forceRTL(true);

export default function App() {
  return <MapScreen />;
}
