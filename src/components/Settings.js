import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as FileSystem from 'expo-file-system';

const Settings = ({
  visible,
  onClose,
  darkMode,
  toggleDarkMode,
  demoMode,
  toggleDemoMode,
  totalAudioSize,
  audioFiles,
  saveAudioEnabled,
  setSaveAudioEnabled
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLicenses, setShowLicenses] = useState(false);
  const [showAudioData, setShowAudioData] = useState(false);

  if (!visible) return null;

  const bgColor = darkMode ? '#111827' : '#f9fafb';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#1f2937';
  const subTextColor = darkMode ? '#9ca3af' : '#6b7280';
  const borderColor = darkMode ? '#374151' : '#e5e7eb';
  const accentColor = '#8b5cf6';

  const handleDemoModeToggle = () => {
    toggleDemoMode();
  };

  const formatFileSize = (size) => {
    if (!size) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  };

  const handleDeleteAllAudio = async () => {
    Alert.alert(
      "音声データの削除",
      "すべての音声データを削除してもよろしいですか？この操作は元に戻せません。",
      [
        {
          text: "キャンセル",
          style: "cancel"
        },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(FileSystem.documentDirectory + "audios/", { idempotent: true });
              Alert.alert("完了", "すべての音声データを削除しました");
              // Reset audio files state
              // Note: This would need to be handled in the parent component
            } catch (error) {
              console.error("Failed to delete audio files:", error);
              Alert.alert("エラー", "音声データの削除に失敗しました");
            }
          }
        }
      ]
    );
  };

  const showAboutAlert = () => {
    Alert.alert(
      "VOICE NOTEについて",
      "バージョン: 1.0.0\n\n音声を文字起こしするアプリです。会議や講義の録音、メモ作成などに便利にご利用いただけます。",
      [{ text: "OK" }]
    );
  };

  const TermsContent = () => (
    <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: textColor }]}>利用規約</Text>
        <TouchableOpacity onPress={() => setShowTerms(false)}>
          <Icon name="x" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalScrollView}>
        <Text style={[styles.modalText, { color: textColor }]}>
          {`1. 利用規約

本利用規約（以下「本規約」といいます）は、VOICE NOTEアプリケーション（以下「本アプリ」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）には、本規約に同意いただいた上で、本アプリをご利用いただきます。

2. 本アプリの利用

2.1 ユーザーは、本規約に同意することにより、本アプリを利用することができます。
2.2 本アプリの利用にあたり、ユーザーは自己の責任において、Wi-Fiやモバイルデータ通信などの通信手段を用意するものとします。
2.3 ユーザーは、本アプリの利用に関わる一切の行為について、自己の責任において行うものとします。

3. 禁止事項

ユーザーは、本アプリの利用にあたり、以下の行為を行ってはならないものとします。
3.1 法令または公序良俗に違反する行為
3.2 犯罪行為に関連する行為
3.3 本アプリの運営を妨害する行為
3.4 他のユーザーに不利益、損害、不快感を与える行為
3.5 他人になりすます行為
3.6 反社会的勢力に対して直接または間接に利益を供与する行為
3.7 その他、当社が不適切と判断する行為

4. 本アプリの変更・停止

4.1 当社は、ユーザーに通知することなく、本アプリの内容を変更したり、本アプリの提供を停止または中止することができるものとします。
4.2 当社は、本アプリの変更・停止によってユーザーに生じた損害について、一切の責任を負わないものとします。

5. 免責事項

5.1 当社は、本アプリの内容の正確性、完全性、有用性等について、いかなる保証も行わないものとします。
5.2 当社は、本アプリの利用によってユーザーに生じた損害について、一切の責任を負わないものとします。
5.3 当社は、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負わないものとします。

6. 利用規約の変更

当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。変更後の利用規約は、本アプリ上に表示された時点で効力を生じるものとします。

7. 準拠法・裁判管轄

7.1 本規約の解釈にあたっては、日本法を準拠法とします。
7.2 本アプリに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。

以上`}
        </Text>
      </ScrollView>
    </View>
  );

  const PrivacyContent = () => (
    <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: textColor }]}>プライバシーポリシー</Text>
        <TouchableOpacity onPress={() => setShowPrivacy(false)}>
          <Icon name="x" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalScrollView}>
        <Text style={[styles.modalText, { color: textColor }]}>
          {`1. プライバシーポリシー

本プライバシーポリシー（以下「本ポリシー」といいます）は、VOICE NOTEアプリケーション（以下「本アプリ」といいます）における、ユーザーの個人情報の取扱いについて定めるものです。

2. 収集する情報

本アプリでは、以下の情報を収集することがあります。
2.1 ユーザーが入力した情報（文字起こしのテキスト、タイトル等）
2.2 デバイス情報（OSのバージョン、デバイスの種類等）
2.3 ログ情報（利用状況、エラー情報等）
2.4 マイクから録音された音声データ

3. 情報の利用目的

収集した情報は、以下の目的で利用します。
3.1 本アプリの提供・運営
3.2 本アプリの改善・新機能の開発
3.3 ユーザーサポート
3.4 利用規約に違反する行為への対応
3.5 その他、上記の利用目的に付随する目的

4. 情報の管理

4.1 ユーザーが本アプリに入力した文字起こしデータは、原則としてユーザーのデバイス内に保存され、当社のサーバーには送信されません。
4.2 音声データは文字起こし処理のために一時的にサーバーに送信されることがありますが、処理完了後は速やかに削除されます。
4.3 当社は、収集した情報の漏洩、滅失または毀損の防止その他収集した情報の適切な管理のために必要な措置を講じます。

5. 第三者提供

当社は、以下の場合を除き、収集した情報を第三者に提供することはありません。
5.1 ユーザーの同意がある場合
5.2 法令に基づく場合
5.3 人の生命、身体または財産の保護のために必要がある場合
5.4 公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合
5.5 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合

6. 外部サービスとの連携

本アプリは、文字起こし処理のために外部のAPIサービスを利用することがあります。これらのサービスの利用においては、各サービスのプライバシーポリシーが適用されます。

7. プライバシーポリシーの変更

当社は、必要と判断した場合には、ユーザーに通知することなく本ポリシーを変更することができるものとします。変更後のプライバシーポリシーは、本アプリ上に表示された時点で効力を生じるものとします。

8. お問い合わせ

本ポリシーに関するお問い合わせは、本アプリ内の問い合わせフォームまでお願いいたします。

以上`}
        </Text>
      </ScrollView>
    </View>
  );

  const LicensesContent = () => (
    <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: textColor }]}>ライセンス情報</Text>
        <TouchableOpacity onPress={() => setShowLicenses(false)}>
          <Icon name="x" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalScrollView}>
        <Text style={[styles.modalText, { color: textColor }]}>
          {`本アプリは以下のオープンソースソフトウェアを使用しています：

React Native
MIT License
Copyright (c) Meta Platforms, Inc. and affiliates.

Expo
MIT License
Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

React Native Vector Icons
MIT License
Copyright (c) 2015 Joel Arvidsson

@react-native-async-storage/async-storage
MIT License
Copyright (c) 2015-present, Facebook, Inc.

expo-av
MIT License
Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

expo-file-system
MIT License
Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

expo-linear-gradient
MIT License
Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

各ライブラリの詳細なライセンス情報については、各プロジェクトのリポジトリをご確認ください。`}
        </Text>
      </ScrollView>
    </View>
  );

  const AudioDataContent = () => {
    // Sort audio files by size (largest first)
    const sortedAudioFiles = [...(audioFiles || [])].sort((a, b) => b.size - a.size);
    
    return (
      <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: textColor }]}>音声データ管理</Text>
          <TouchableOpacity onPress={() => setShowAudioData(false)}>
            <Icon name="x" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScrollView}>
          <Text style={[styles.audioDataTitle, { color: textColor }]}>
            総サイズ: {formatFileSize(totalAudioSize)}
          </Text>
          
          {sortedAudioFiles.length > 0 ? (
            <>
              <Text style={[styles.audioDataSubtitle, { color: textColor }]}>
                ファイルサイズランキング
              </Text>
              {sortedAudioFiles.map((file, index) => (
                <View key={index} style={[styles.audioFileItem, { borderColor }]}>
                  <Text style={[styles.audioFileName, { color: textColor }]}>
                    {file.uri.split('/').pop()}
                  </Text>
                  <Text style={[styles.audioFileSize, { color: subTextColor }]}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
              ))}
              
              <TouchableOpacity 
                style={[styles.deleteAllButton, { backgroundColor: '#ef4444' }]}
                onPress={handleDeleteAllAudio}
              >
                <Text style={styles.deleteAllButtonText}>すべての音声データを削除</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.noAudioText, { color: subTextColor }]}>
              保存された音声データはありません
            </Text>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>設定</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>アプリ設定</Text>
          
          <View style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: textColor }]}>ダークモード</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                ダークテーマを使用する
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#8b5cf6' }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          <View style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: textColor }]}>デモモード</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                APIを使わずにデモデータを使用する
              </Text>
            </View>
            <Switch
              value={demoMode}
              onValueChange={handleDemoModeToggle}
              trackColor={{ false: '#767577', true: '#8b5cf6' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, { color: textColor }]}>音声データを保存</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                文字起こし後も音声データを保持する
              </Text>
            </View>
            <Switch
              value={saveAudioEnabled}
              onValueChange={setSaveAudioEnabled}
              trackColor={{ false: '#767577', true: '#8b5cf6' }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>データ管理</Text>
          
          <TouchableOpacity 
            style={[styles.legalItem, { borderColor }]}
            onPress={() => setShowAudioData(true)}
          >
            <View style={styles.settingTextContainer}>
              <Text style={[styles.legalItemText, { color: textColor }]}>音声データ管理</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                総サイズ: {formatFileSize(totalAudioSize)}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>法的情報</Text>
          
          <TouchableOpacity 
            style={[styles.legalItem, { borderColor }]}
            onPress={() => setShowTerms(true)}
          >
            <Text style={[styles.legalItemText, { color: textColor }]}>利用規約</Text>
            <Icon name="chevron-right" size={20} color={textColor} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.legalItem, { borderColor }]}
            onPress={() => setShowPrivacy(true)}
          >
            <Text style={[styles.legalItemText, { color: textColor }]}>プライバシーポリシー</Text>
            <Icon name="chevron-right" size={20} color={textColor} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.legalItem, { borderColor }]}
            onPress={() => setShowLicenses(true)}
          >
            <Text style={[styles.legalItemText, { color: textColor }]}>ライセンス情報</Text>
            <Icon name="chevron-right" size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.aboutButton, { backgroundColor: accentColor }]}
            onPress={showAboutAlert}
          >
            <Text style={styles.aboutButtonText}>VOICE NOTEについて</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Terms Modal */}
      <Modal
        visible={showTerms}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalContainer}>
          <TermsContent />
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacy}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPrivacy(false)}
      >
        <View style={styles.modalContainer}>
          <PrivacyContent />
        </View>
      </Modal>

      {/* Licenses Modal */}
      <Modal
        visible={showLicenses}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLicenses(false)}
      >
        <View style={styles.modalContainer}>
          <LicensesContent />
        </View>
      </Modal>

      {/* Audio Data Modal */}
      <Modal
        visible={showAudioData}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAudioData(false)}
      >
        <View style={styles.modalContainer}>
          <AudioDataContent />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  legalItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  aboutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
  },
  audioDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  audioDataSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  audioFileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  audioFileName: {
    fontSize: 14,
    flex: 1,
  },
  audioFileSize: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteAllButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  deleteAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noAudioText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default Settings;
