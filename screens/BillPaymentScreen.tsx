import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { billService } from '../services/billService';
import { BillProvider, BillCategory } from '../types/bills';
import { BillPaymentForm } from '../components/BillPaymentForm';
import { useTheme } from '../theme/ThemeProvider';

// Static import mapping for category icons
const CATEGORY_ICONS = {
  utility: require('../assets/icons/utility.svg'),
  mobile: require('../assets/icons/mobile.svg'),
  internet: require('../assets/icons/internet.svg'),
  streaming: require('../assets/icons/streaming.svg'),
  insurance: require('../assets/icons/insurance.svg'),
  credit_card: require('../assets/icons/credit-card.svg'),
  loan: require('../assets/icons/loan.svg'),
  other: require('../assets/icons/other.svg'),
};

const CATEGORIES: { key: BillCategory; label: string }[] = [
  { key: 'utility', label: 'Utilities' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'internet', label: 'Internet' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'credit_card', label: 'Credit Card' },
  { key: 'loan', label: 'Loan' },
  { key: 'other', label: 'Other' },
];

export const BillPaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<BillProvider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await billService.getProviders();
      setProviders(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = selectedCategory
    ? providers.filter(p => p.category === selectedCategory)
    : providers;

  const handleSuccess = (result: { transactionId: string; receiptUrl: string }) => {
    navigation.navigate('Receipt', {
      transactionId: result.transactionId,
      receiptUrl: result.receiptUrl,
    });
  };

  const handleError = (error: Error | string) => {
    setError(typeof error === 'string' ? error : error.message);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={loadProviders}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {selectedProvider ? (
        <BillPaymentForm
          providerId={selectedProvider}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      ) : (
        <ScrollView>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Categories
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor:
                        selectedCategory === category.key
                          ? theme.colors.primary
                          : theme.colors.surface,
                    },
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.key ? null : category.key
                  )}
                >
                  <Image source={CATEGORY_ICONS[category.key]} style={styles.categoryIcon} />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          selectedCategory === category.key
                            ? theme.colors.textInverse
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Providers */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Service Providers
            </Text>
            <View style={styles.providersGrid}>
              {filteredProviders.map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() => setSelectedProvider(provider.id)}
                >
                  {provider.logo_url ? (
                    <Image
                      source={{ uri: provider.logo_url }}
                      style={styles.providerLogo}
                    />
                  ) : (
                    <View
                      style={[
                        styles.providerPlaceholder,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Text style={[styles.providerInitial, { color: theme.colors.textInverse }]}>
                        {provider.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[styles.providerName, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {provider.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  providerCard: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  providerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  providerPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInitial: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  providerName: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 