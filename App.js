import 'react-native-gesture-handler';
import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, LogBox, TextInput, Pressable, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { LayoutDashboard, Bot, Activity, CloudRain, AlertCircle, Send, User, HeartPulse, ScanFace, FileBox, Droplet, Footprints, Settings, Trash2, Sparkles, Code2, GraduationCap, Pill, CheckCircle2, Circle, Trophy } from 'lucide-react-native';

LogBox.ignoreAllLogs();

// Snack için güvenli ikon haritası
const IconMap = {
    LayoutDashboard, Bot, Activity, CloudRain, AlertCircle, Send, User, HeartPulse, ScanFace, FileBox, Droplet, Footprints, Settings, Trash2, Sparkles, Code2, GraduationCap, Pill, CheckCircle2, Circle, Trophy
};

// -----------------------------------------------------------------------------------------
// 0. GLOBAL STATE (Health Profile Context)
// -----------------------------------------------------------------------------------------
const HealthContext = createContext();

const HealthProvider = ({ children }) => {
    const [name, setName] = useState('Utku');
    const [role, setRole] = useState('Yazılım Mühendisliği');
    const [height, setHeight] = useState('180');
    const [weight, setWeight] = useState('75');

    // AI Daily Tip Generator (Stability logic)
    const [dailyTip, setDailyTip] = useState("");

    useEffect(() => {
        const tips = [
            "Utku hocam, bugün Samsun Üniversitesi kampüsünde yürüyüş yapmayı unutmayın!",
            "Günaydın Utku! Harika bir kodlama seansı öncesinde sıvı tüketmeyi ihmal etme.",
            "VKE Durumunuz mükemmel görünüyor. Günlük hedeflerini tutturmaya devam et Utku."
        ];
        setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
    }, []);

    const hMeters = parseFloat(height) / 100;
    const wKg = parseFloat(weight);
    let bmi = "0.0";
    let bmiStatus = "Hesaplanıyor...";
    let healthScore = 92; // Mock score

    if (hMeters > 0 && wKg > 0) {
        bmi = (wKg / (hMeters * hMeters)).toFixed(1);
        if (bmi < 18.5) { bmiStatus = "Zayıf (Düşük)"; healthScore = 75; }
        else if (bmi >= 18.5 && bmi <= 24.9) { bmiStatus = "Normal (İdeal)"; healthScore = 98; }
        else if (bmi >= 25 && bmi <= 29.9) { bmiStatus = "Fazla Kilolu"; healthScore = 82; }
        else { bmiStatus = "Obezite (Riskli)"; healthScore = 65; }
    }

    return (
        <HealthContext.Provider value={{ name, setName, role, setRole, height, setHeight, weight, setWeight, bmi, bmiStatus, healthScore, dailyTip }}>
            {children}
        </HealthContext.Provider>
    );
};

// -----------------------------------------------------------------------------------------
// 1. ZERO-API SMART SIMULATION (Sıfır Hata Haftalık Matris & Tansiyon Modülü)
// -----------------------------------------------------------------------------------------
const processChatToUI = async (userMessage, bmiInfo) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const lowerMsg = userMessage.toLowerCase();

    // 1. TANSİYON GRAFİK MODÜLÜ KONTROLÜ
    if (lowerMsg.includes("tansiyon") || lowerMsg.includes("kalp") || lowerMsg.includes("basınç")) {
        return {
            reply: "Tansiyon verinizi inceledim. Gelişiminizi izleyebilmeniz için '7 Günlük Dinamik Tansiyon Grafiği' Dashboard'a eklendi.",
            sduiBlock: {
                type: "mockChart",
                props: {
                    title: "Haftalık Sistolik Tansiyon",
                    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
                    dataPoints: [118, 122, 115, 126, 120, 119, 121] // Random Mock Data
                }
            }
        };
    }

    // 2. HAFTALIK İLAÇ/HEDEF MATRİSİ KONTROLÜ
    let cleanVal = userMessage
        .replace(/haftalık/gi, "")
        .replace(/içmem lazım/gi, "")
        .replace(/içmem/gi, "")
        .replace(/lazım/gi, "")
        .replace(/gerekiyor/gi, "")
        .replace(/hapı/gi, "")
        .replace(/ilacı/gi, "")
        .replace(/ekle/gi, "").trim();

    if (cleanVal.length < 2) cleanVal = userMessage;
    const finalDrugName = cleanVal.charAt(0).toUpperCase() + cleanVal.slice(1);

    return {
        reply: "Elbette. '" + finalDrugName + "' için 7 günlük interaktif ilaç matrisinizi Dashboard ekranındaki Sağlık Komuta Merkezinize ekledim.",
        sduiBlock: {
            type: "weeklyTracker",
            props: {
                label: finalDrugName,
                days: [
                    { name: "Pzt", checked: false },
                    { name: "Sal", checked: false },
                    { name: "Çar", checked: false },
                    { name: "Per", checked: false },
                    { name: "Cum", checked: false },
                    { name: "Cmt", checked: false },
                    { name: "Paz", checked: false }
                ]
            }
        }
    };
};

// -----------------------------------------------------------------------------------------
// 2. THEME SYSTEM
// -----------------------------------------------------------------------------------------
const theme = {
    colors: {
        primary: '#00897B', primaryVariant: '#00695C', secondary: '#8E24AA',
        background: '#F0F4F4', surface: '#FFFFFF', error: '#D32F2F',
        onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onBackground: '#202124',
        onSurface: '#3C4043', onSurfaceVariant: '#5F6368', success: '#388E3C'
    },
    typography: {
        title: { fontSize: 18, fontWeight: '600' }, body: { fontSize: 16, fontWeight: '400' },
        label: { fontSize: 14, fontWeight: '600' }, caption: { fontSize: 12, fontWeight: '400' },
        sectionTitle: { fontSize: 20, fontWeight: '800' }
    },
    shadows: {
        elevation1: { shadowColor: '#00897B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
        elevation2: { shadowColor: '#00897B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
        elevation3: { shadowColor: '#00695C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }
    }
};

// -----------------------------------------------------------------------------------------
// 3. BASE DASHBOARD SCHEMA ("SAĞLIK KOMUTA MERKEZİ")
// -----------------------------------------------------------------------------------------
const dashboardData = {
    metadata: { version: "9.0", iteration_weight: "Master Command Center" },
    layout: {
        type: "scrollView",
        props: { style: "container" },
        children: [
            { type: "headerCtx", props: { title: "Hoş Geldiniz" } },

            // Visual Progress Bars
            {
                type: "rowWidgets",
                children: [
                    { type: "progressCard", props: { style: "miniWidget", icon: "Droplet", label: "Su (L)", value: 1.8, max: 2.5, color: "primary" } },
                    { type: "progressCard", props: { style: "miniWidget", icon: "Footprints", label: "Adım", value: 6500, max: 10000, color: "primaryVariant" } }
                ]
            },

            // Aktif Modüller Başlığı
            { type: "text", props: { content: { tr: "Aktif Takip Modülleri" }, style: "sectionTitle", color: "primaryVariant" } }
        ]
    }
};

// -----------------------------------------------------------------------------------------
// 4. SDUI CORE ENGINE
// -----------------------------------------------------------------------------------------
const translate = (contentObj) => typeof contentObj === 'string' ? contentObj : (contentObj?.tr || 'Text Yok');

function UIRenderer({ schema, isFocused }) {
    const { name, bmi, bmiStatus, healthScore, dailyTip } = useContext(HealthContext);
    const [dynamicChildren, setDynamicChildren] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useFocusEffect(useCallback(() => {
        let isMounted = true;
        const loadState = async () => {
            try {
                const savedLayout = await AsyncStorage.getItem('@utku_sdui_state');
                if (isMounted) {
                    setDynamicChildren(savedLayout ? JSON.parse(savedLayout) : schema.layout?.children || []);
                    setIsReady(true);
                }
            } catch (e) {
                if (isMounted) { setDynamicChildren(schema.layout?.children || []); setIsReady(true); }
            }
        };
        loadState();
        return () => { isMounted = false; };
    }, [schema]));

    // Haftalık İlaç İşaretleyici Motor
    const handleToggleWeeklyDay = async (node, dayIndex) => {
        node.props.days[dayIndex].checked = !node.props.days[dayIndex].checked;
        const clonedState = [...dynamicChildren];
        setDynamicChildren(clonedState);
        await AsyncStorage.setItem('@utku_sdui_state', JSON.stringify(clonedState));
    };

    const renderNode = (node, index) => {
        if (!node) return null;
        const { type, props = {}, children = [] } = node;
        const key = "node-" + index + "-" + type + "-" + Math.random();
        const elevationStyle = props.elevation ? theme.shadows["elevation" + props.elevation] : {};
        let buttonOverride = props.style === 'primaryButton' ? { backgroundColor: theme.colors.primary } : {};

        switch (type) {
            case 'scrollView':
                return <ScrollView showsVerticalScrollIndicator={false} key={key} style={styles.container}>{dynamicChildren.map((child, i) => renderNode(child, i))}<View style={{ height: 100 }} /></ScrollView>;

            case 'headerCtx':
                return (
                    <View key={key} style={styles.greetingsBlock}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View>
                                <Text style={styles.greetTitle}>{props.title} {name},</Text>
                                <View style={styles.vkeChip}>
                                    <HeartPulse size={16} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.vkeText}>VKE: {bmi} ({bmiStatus})</Text>
                                </View>
                            </View>
                            <View style={styles.scoreCircle}>
                                <Trophy size={18} color="#00897B" />
                                <Text style={styles.scoreText}>%{healthScore}</Text>
                            </View>
                        </View>

                        {/* AI Daily Tip Banner */}
                        <View style={styles.dailyTipBanner}>
                            <Bot size={20} color="#00695C" />
                            <Text style={styles.dailyTipText}>{dailyTip}</Text>
                        </View>
                    </View>
                );

            case 'rowWidgets':
                return <View key={key} style={styles.rowLayout}>{children.map((child, i) => renderNode(child, i))}</View>;

            case 'progressCard':
                const PIcon = IconMap[props.icon];
                let percent = (props.value / props.max) * 100;
                if (percent > 100) percent = 100;
                return (
                    <View key={key} style={[styles.miniCard, theme.shadows.elevation1]}>
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            {PIcon && <PIcon size={24} color={theme.colors[props.color] || theme.colors.primary} />}
                            <Text style={styles.cardSub}>{props.value} / {props.max}</Text>
                        </View>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: percent + "%", backgroundColor: theme.colors[props.color] || theme.colors.primary }]} />
                        </View>
                        <Text style={[styles.cardTitle, { marginTop: 10 }]}>{props.label}</Text>
                    </View>
                );

            case 'weeklyTracker':
                return (
                    <View key={key} style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadows.elevation1]}>
                        <View style={styles.badgeContainer}>
                            <Pill size={12} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.badgeText}>HAFTALIK</Text>
                        </View>
                        <Text style={styles.weeklyTitleText}>{props.label}</Text>
                        <View style={styles.weeklyDaysRow}>
                            {props.days && props.days.map((dayObj, dIdx) => {
                                const isDone = dayObj.checked;
                                return (
                                    <Pressable key={dIdx} style={styles.dayCol} onPress={() => handleToggleWeeklyDay(node, dIdx)}>
                                        {isDone ? <CheckCircle2 size={30} color={theme.colors.success} /> : <Circle size={30} color={theme.colors.onSurfaceVariant} />}
                                        <Text style={[styles.daySubText, isDone && { color: theme.colors.success, fontWeight: '700' }]}>{dayObj.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );

            case 'mockChart':
                return (
                    <View key={key} style={[styles.card, { backgroundColor: theme.colors.surface }, theme.shadows.elevation1]}>
                        <View style={[styles.badgeContainer, { backgroundColor: '#1E88E5' }]}>
                            <Activity size={12} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.badgeText}>ANALİZ</Text>
                        </View>
                        <Text style={styles.weeklyTitleText}>{props.title}</Text>
                        <View style={styles.chartContainer}>
                            {props.dataPoints && props.dataPoints.map((val, idx) => (
                                <View key={idx} style={styles.chartBarWrapper}>
                                    <Text style={styles.chartLabelTop}>{val}</Text>
                                    <View style={[styles.chartBar, { height: val * 0.8, backgroundColor: theme.colors.primaryVariant }]} />
                                    <Text style={styles.chartLabelBot}>{props.labels[idx]}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            case 'text':
                const textStyleChoice = props.style === 'title' ? styles.cardTitleText : props.style === 'sectionTitle' ? styles.sectionTitleText : styles.cardTitleText;
                const textColor = props.style === 'buttonText' ? '#FFF' : (node.props?.color ? theme.colors[node.props.color] : theme.colors.onSurface);
                return <Text key={key} style={[textStyleChoice, { color: textColor }]}>{translate(props.content)}</Text>;

            default: return null;
        }
    };

    if (!isReady) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#00897B" /></View>;
    return <View style={styles.engineContainer}>{renderNode(schema.layout, 0)}</View>;
}

// -----------------------------------------------------------------------------------------
// 5. APP SCREENS & NAVIGATION
// -----------------------------------------------------------------------------------------
function DashboardScreen() {
    return <UIRenderer schema={dashboardData} />;
}

function ChatScreen() {
    const { bmi, bmiStatus } = useContext(HealthContext);
    const [messages, setMessages] = useState([{ role: 'assistant', text: "U.T.K.U. Komuta Merkezine Hoşgeldiniz.\n\nİlaç takvimi kurabilir, veya 'Tansiyon grafiğimi çıkar' komutuyla analiz başlatabilirsiniz." }]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const userMsg = inputText.trim();
        setInputText('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        const promptBmiInfo = "VKE: " + bmi + " (" + bmiStatus + ")";
        const { reply, sduiBlock } = await processChatToUI(userMsg, promptBmiInfo);

        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);

        if (sduiBlock) {
            try {
                const rawState = await AsyncStorage.getItem('@utku_sdui_state');
                let currentState = rawState ? JSON.parse(rawState) : dashboardData.layout.children;
                // currentState Formatı: [0] Header, [1] ProgressBars, [2] Title, ...[İlaç Kartları]
                // 4. sıradan (index 3) yeni modülü zerk et!
                const headerObj = currentState[0];
                const pbObj = currentState[1];
                const titleObj = currentState[2];
                const updatedState = [headerObj, pbObj, titleObj, sduiBlock, ...currentState.slice(3)];
                await AsyncStorage.setItem('@utku_sdui_state', JSON.stringify(updatedState));
                Alert.alert("Komuta Merkezi Güncellendi", "Yeni sensör Modülü kalıcı belleğe kazındı.");
            } catch (e) { console.error("Injection Fail", e); }
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.messageScroll}>
                {messages.map((m, i) => (
                    <View key={i} style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.botBubble]}>
                        <Text style={[styles.messageText, m.role === 'user' ? { color: '#FFF' } : { color: '#333' }]}>{m.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputArea}>
                <TextInput style={styles.textInput} placeholder="İlaç veya Analiz ismi yazın..." value={inputText} onChangeText={setInputText} editable={!isLoading} />
                <Pressable onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#FFF" /> : <Send color="#FFF" size={20} />}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

function ProfileScreen() {
    const { name, setName, role, setRole, height, setHeight, weight, setWeight } = useContext(HealthContext);

    const handleClearData = async () => {
        Alert.alert("Komuta Merkezini Sıfırla", "Tüm analiz ve ilaç takvimleri kalıcı olarak silinecektir.", [
            { text: "İptal", style: "cancel" },
            {
                text: "Sil", style: "destructive",
                onPress: async () => { await AsyncStorage.clear(); Alert.alert("Sıfırlandı!", "Dashboard yenilendi."); }
            }
        ]);
    };

    return (
        <ScrollView style={styles.engineContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                    <User size={48} color="#FFF" />
                </View>
                <TextInput style={styles.profileNameEdit} value={name} onChangeText={setName} placeholder="Ad Soyad" placeholderTextColor="#ccc" />
                <Text style={styles.profileRole}>Efsanevi Mimari (Komuta Merkezi) 🏆</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.vkeHeader}>Vücut Kitle Endeksi Referans Verileri</Text>

                <View style={styles.editRow}>
                    <Text style={styles.editLabel}>Boy (cm):</Text>
                    <TextInput style={styles.editInput} value={height} onChangeText={setHeight} keyboardType="numeric" maxLength={3} />
                </View>

                <View style={styles.editRow}>
                    <Text style={styles.editLabel}>Kilo (kg):</Text>
                    <TextInput style={styles.editInput} value={weight} onChangeText={setWeight} keyboardType="numeric" maxLength={3} />
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.infoRow}><GraduationCap size={24} color="#00897B" />
                    <View style={styles.infoTextContainer}>
                        <TextInput style={styles.infoTitleEdit} value={role} onChangeText={setRole} />
                        <Text style={styles.infoValue}>Samsun Üniversitesi</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoCard}>
                <Pressable style={styles.clearButton} onPress={handleClearData}>
                    <Trash2 size={24} color="#D32F2F" />
                    <Text style={styles.clearButtonText}>Tüm İlaç & Analiz Çizelgesini Sıfırla</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const Tab = createBottomTabNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false, tabBarActiveTintColor: '#00897B', tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60, backgroundColor: '#FFF', borderTopWidth: 0, elevation: 10 },
                    tabBarIcon: ({ color, size }) => {
                        if (route.name === 'Komuta') return <LayoutDashboard color={color} size={size} />;
                        if (route.name === 'Chat') return <Bot color={color} size={size} />;
                        if (route.name === 'Profil') return <Activity color={color} size={size} />;
                    },
                })}
            >
                <Tab.Screen name="Komuta" component={DashboardScreen} />
                <Tab.Screen name="Chat" component={ChatScreen} />
                <Tab.Screen name="Profil" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <HealthProvider>
            <AppNavigation />
        </HealthProvider>
    );
}

// -----------------------------------------------------------------------------------------
// 6. SHARED STYLES
// -----------------------------------------------------------------------------------------
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1 },
    engineContainer: { flex: 1, backgroundColor: '#F0F4F4' },
    centerContainer: { flex: 1, backgroundColor: '#F0F4F4', justifyContent: 'center', alignItems: 'center', padding: 24 },

    // Greetings & Top Header Info
    greetingsBlock: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
    greetTitle: { fontSize: 26, fontWeight: '800', color: '#00695C' },
    vkeChip: { backgroundColor: '#00897B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    vkeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00897B' },
    scoreText: { fontSize: 14, fontWeight: '800', color: '#00695C', marginTop: 2 },

    // AI Daily Tip Banner
    dailyTipBanner: { flexDirection: 'row', backgroundColor: '#E0F2F1', padding: 16, borderRadius: 16, marginTop: 20, alignItems: 'center', gap: 12 },
    dailyTipText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#004D40', fontStyle: 'italic', lineHeight: 18 },

    // Visual Progress Bars
    rowLayout: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 16, marginTop: 10 },
    miniCard: { flex: 1, borderRadius: 20, padding: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'flex-start' },
    progressTrack: { width: '100%', height: 6, backgroundColor: '#E0F2F1', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#3C4043' },
    cardSub: { fontSize: 13, color: '#5F6368', marginTop: 4, fontWeight: '500' },

    sectionTitleText: { fontSize: 22, fontWeight: '800', marginHorizontal: 20, marginVertical: 12 },
    card: { borderRadius: 20, padding: 20, marginBottom: 16, marginHorizontal: 20, position: 'relative', overflow: 'hidden' },

    // CheckCircle İlaç Matrisi
    weeklyTrackerWrapper: { width: '100%', marginTop: 8 },
    weeklyTitleText: { fontSize: 18, fontWeight: '800', color: '#004D40', marginBottom: 20, textAlign: 'left', marginLeft: 4, marginTop: 8 },
    weeklyDaysRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    dayCol: { alignItems: 'center', justifyContent: 'center', gap: 6 },
    daySubText: { fontSize: 12, fontWeight: '600', color: '#5F6368' },

    // Tansiyon Grafik (Mock Chart) Modülü
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, paddingTop: 10 },
    chartBarWrapper: { alignItems: 'center', flex: 1, gap: 4 },
    chartLabelTop: { fontSize: 11, fontWeight: '700', color: '#00695C' },
    chartBar: { width: 22, borderRadius: 4 },
    chartLabelBot: { fontSize: 11, fontWeight: '600', color: '#5F6368', marginTop: 4 },

    // Badges 
    badgeContainer: { position: 'absolute', top: 0, right: 0, backgroundColor: '#D32F2F', paddingHorizontal: 16, paddingVertical: 6, borderBottomLeftRadius: 16, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
    badgeText: { fontSize: 10, fontWeight: '900', color: '#FFF', letterSpacing: 0.8 },
    cardTitleText: { fontSize: 18, fontWeight: '600', color: '#3C4043', textAlign: 'center' },

    // Chat Screen
    chatContainer: { flex: 1, backgroundColor: '#FFF', padding: 16, paddingTop: 50 },
    messageScroll: { paddingBottom: 20 },
    messageBubble: { padding: 14, borderRadius: 20, marginBottom: 12, maxWidth: '85%' },
    userBubble: { backgroundColor: '#00897B', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    botBubble: { backgroundColor: '#F0F4F4', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    inputArea: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingTop: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F0F4F4' },
    textInput: { flex: 1, backgroundColor: '#F0F4F4', padding: 16, borderRadius: 30, fontSize: 16, color: '#3C4043' },
    sendButton: { backgroundColor: '#00897B', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: '#00897B', shadowOpacity: 0.4, shadowRadius: 4, shadowOffset: { width: 0, height: 4 } },

    // Profile Screen
    profileHeader: { backgroundColor: '#00897B', paddingVertical: 40, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 20, paddingTop: 60 },
    profileAvatar: { width: 90, height: 90, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    profileNameEdit: { fontSize: 28, fontWeight: '700', color: '#FFF', textAlign: 'center', minWidth: 150 },
    profileRole: { fontSize: 14, color: '#B2DFDB', marginTop: 4, fontWeight: '700' },
    infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#00897B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    infoTextContainer: { marginLeft: 16 },
    infoTitleEdit: { fontSize: 16, color: '#5F6368', fontWeight: '500', padding: 0 },
    infoValue: { fontSize: 16, color: '#00695C', fontWeight: '700', marginTop: 2 },
    clearButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 12 },
    clearButtonText: { color: '#D32F2F', fontSize: 16, fontWeight: '600' },
    vkeHeader: { fontSize: 16, fontWeight: '700', color: '#00695C', marginBottom: 16 },
    editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, backgroundColor: '#F0F4F4', padding: 12, borderRadius: 12 },
    editLabel: { fontSize: 16, color: '#3C4043', fontWeight: '600' },
    editInput: { fontSize: 18, fontWeight: '700', color: '#00897B', textAlign: 'right', minWidth: 60, padding: 0 }
});