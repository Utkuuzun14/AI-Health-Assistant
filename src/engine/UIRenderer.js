import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import * as LucideIcons from 'lucide-react-native';
import { getStitchTheme } from '../theme/stitch';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// i18n Fallback helper
const translate = (contentObj, lang = 'en') => {
  if (typeof contentObj === 'string') return contentObj;
  if (!contentObj) return '';
  return contentObj[lang] || contentObj['en'] || 'Mising trnslation';
};

class HealthMetaAgent {
  constructor() {
    this.interactions = {};
  }
  
  track(actionPath) {
    if (actionPath.includes('ACTION_')) return null; 
    
    this.interactions[actionPath] = (this.interactions[actionPath] || 0) + 1;
    console.log(`[Health Agent] Etkileşim: ${actionPath} (${this.interactions[actionPath]} kez)`);
    
    // Simulate "High Blood Pressure Risk" after 2 taps on vitals
    if (actionPath === 'card_vitals_click' && this.interactions[actionPath] === 2) {
      console.log(`[Health Agent] Boss Level Pattern Detected! Suggesting Salt Tracking...`);
      return {
        type: 'card',
        props: { style: 'aiCard', elevation: 2, accessibilityLabel: "Salt Tracking AI Suggestion" },
        children: [
          { type: 'icon', props: { name: 'AlertCircle', color: 'error', size: 32 } },
          { type: 'text', props: { style: 'title', content: { en: "AI Suggestion: High BP Risk! Added Salt Tracker to dashboard.", tr: "AI Önerisi: Tansiyon yüksek görünüyor, Tuz Takip grafiğini ana ekrana ekledim!" } } }
        ]
      };
    }
    return null;
  }
}

const tracker = new HealthMetaAgent();

export default function UIRenderer(props) {
  const schema = props.schema || props.data;
  const lang = props.lang || 'tr';
  
  const colorScheme = useColorScheme();
  const theme = getStitchTheme(colorScheme);
  
  const [dynamicChildren, setDynamicChildren] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // useFocusEffect enables "Chat-Driven SDUI" sync so when user comes back from Chat, parsing updates perfectly!
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const loadState = async () => {
        try {
          const savedLayout = await AsyncStorage.getItem('@utku_sdui_state');
          if (isMounted) {
             if (savedLayout) {
               console.log("[Sync] Yüklenen cihaz senkronizasyonu (Voice/Chat Injection bulundu)...");
               setDynamicChildren(JSON.parse(savedLayout));
             } else {
               setDynamicChildren(schema.layout?.children || []);
             }
             setIsReady(true);
          }
        } catch (e) {
          console.error("Storage error:", e);
          if (isMounted) {
            setDynamicChildren(schema.layout?.children || []);
            setIsReady(true);
          }
        }
      };

      loadState();
      
      return () => { isMounted = false; };
    }, [schema])
  );

  // Auto-Save when dynamicChildren changes while on this screen
  const persistState = async (newChildren) => {
      try {
          await AsyncStorage.setItem('@utku_sdui_state', JSON.stringify(newChildren));
      } catch (err) {
          console.error("Save state error:", err);
      }
  };

  const handleInteraction = (action) => {
    if (!action) return;
    
    if (action === 'ACTION_AUTO_DOC') {
      generateAutoDoc();
      return;
    }

    const suggestion = tracker.track(action);
    if (suggestion) {
      // Dynamic Boss Level Injection and Persistence
      const newLayout = [suggestion, ...dynamicChildren];
      setDynamicChildren(newLayout);
      persistState(newLayout);
    }
  };

  const generateAutoDoc = async () => {
    console.log("[Auto-Doc] PDF Raporu Hazırlanıyor...");
    const htmlObj = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
          <h1 style="color: #00897B;">U.T.K.U. Health Assistant</h1>
          <h2>Sistem Mimari ve Chat-Driven SDUI Raporu</h2>
          <hr />
          <p><strong>Zeka Kaynağı:</strong> Voice & Chat Driven (Natural Language Parser)</p>
          <p><strong>Aktif Ağaç Düğüm Sayısı:</strong> ${dynamicChildren.length}</p>
          <p><strong>Tıbbi Veriler:</strong> Algoritma anlık olarak ${dynamicChildren.length} düğümü senkronize etmektedir.</p>
          <small>Üretim Tarihi: ${new Date().toLocaleString()}</small>
        </body>
      </html>
    `;
    
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlObj });
      console.log('PDF:', uri);
      await Sharing.shareAsync(uri);
    } catch (e) { }
  };

  const renderNode = (node, index) => {
    const { type, props = {}, children = [] } = node;
    const key = `node-${index}-${type}-${Math.random()}`; 
    
    const baseStyle = styles[props.style] || {};
    const elevationStyle = props.elevation ? theme.shadows[`elevation${props.elevation}`] : {};
    
    let buttonOverride = {};
    if (props.style === 'primaryButton') buttonOverride = { backgroundColor: theme.colors.primary };
    if (props.style === 'aiButton') buttonOverride = { backgroundColor: theme.colors.secondary };

    const a11yProps = {
      accessible: true,
      accessibilityLabel: props.accessibilityLabel,
      accessibilityRole: props.accessibilityRole,
      accessibilityHint: props.accessibilityHint,
    };

    switch (type) {
      case 'scrollView':
        return (
          <ScrollView key={key} style={[baseStyle]} {...a11yProps}>
            <Animated.View layout={SlideInDown}>
              {dynamicChildren.map((child, i) => renderNode(child, i))}
            </Animated.View>
            <View style={{height: 100}} /> 
          </ScrollView>
        );

      case 'header':
        return (
          <Animated.View key={key} entering={FadeIn.duration(400)} style={[styles.header, { backgroundColor: theme.colors.surface }]} {...a11yProps}>
            <Text style={[theme.typography.h1, { color: theme.colors.onSurface }]}>
              {translate(props.title, lang)}
            </Text>
          </Animated.View>
        );

      case 'weatherWidget':
        return (
          <Animated.View key={key} entering={FadeIn.duration(400)} style={[styles.card, { backgroundColor: theme.colors.surface }, elevationStyle]} {...a11yProps}>
             <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
               <LucideIcons.CloudRain size={24} color={theme.colors.primaryVariant} />
               <View>
                 <Text style={[theme.typography.label, { color: theme.colors.onSurface }]}>{props.mockValue || "Hava Kalitesi: 42 AQI"}</Text>
                 <Text style={[theme.typography.caption, { color: theme.colors.onSurfaceVariant }]}>{props.mockPolen || "Polen: Düşük"}</Text>
               </View>
             </View>
          </Animated.View>
        );

      case 'card':
        return (
          <Pressable key={key} onPress={() => handleInteraction('card_vitals_click')}>
            <Animated.View entering={SlideInDown.delay(index * 50).duration(400)} exiting={FadeOut} style={[styles.card, props.style === 'aiCard' ? styles.aiCard : {}, { backgroundColor: theme.colors.surface }, elevationStyle]} {...a11yProps}>
              {children.map((child, i) => renderNode(child, i))}
            </Animated.View>
          </Pressable>
        );

      case 'text':
        return (
          <Text key={key} style={[theme.typography[props.style] || theme.typography.body, { color: theme.colors.onSurface }]} {...a11yProps}>
            {translate(props.content, lang)}
          </Text>
        );

      case 'button':
        return (
          <Pressable 
            key={key} 
            style={({ pressed }) => [
              styles.button, 
              buttonOverride,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => handleInteraction(props.action)}
            {...a11yProps}
          >
            {children.map((child, i) => renderNode(child, i))}
          </Pressable>
        );

      case 'icon':
        const IconComponent = LucideIcons[props.name];
        if (!IconComponent) return null;
        return <IconComponent key={key} color={theme.colors[props.color] || theme.colors.onSurface} size={props.size || 24} />;

      default:
        return null;
    }
  };

  if (!schema || !schema.layout || !isReady) return (
       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
          <ActivityIndicator size="large" color="#00897B" />
       </View>
  );

  return (
    <View style={styles.container}>
      {renderNode(schema.layout, 0)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { paddingVertical: 24, marginBottom: 16, borderRadius: 16, paddingHorizontal: 16 },
  aiCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 24, gap: 12 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, gap: 8, marginBottom: 12 },
});
