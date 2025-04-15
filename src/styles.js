import { StyleSheet } from 'react-native';

export const savedTranscriptionsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  useButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  useButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabButtonTextActive: {
    color: '#111827',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  transcriptionItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemAudioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  itemAudioText: {
    fontSize: 12,
    marginLeft: 4,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  conversationSummary: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  conversationText: {
    fontSize: 14,
  },
  detailScrollView: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  detailText: {
    fontSize: 16,
    lineHeight: 24,
    paddingBottom: 24,
  },
  segmentItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
    borderRadius: 8,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  segmentTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  segmentText: {
    fontSize: 14,
    marginTop: 4,
  },
  segmentHighlight: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
  },
  audioControlContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  audioControlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteAudioButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  sliderContainer: {
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  playPauseButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  playPauseButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  audioErrorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  audioErrorText: {
    color: '#ef4444',
    fontSize: 14,
  },
});
