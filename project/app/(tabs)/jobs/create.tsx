import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Platform, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { cities, villages } from '../../data/locations';

const categories = [
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'painting', name: 'Painting' },
];

export default function CreateJobScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationType, setLocationType] = useState<'city' | 'village' | null>(null);
  const [locationName, setLocationName] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title || !description || !location) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Job posted successfully!');
      router.replace('/jobs');
    }, 1000);
  };

  const handleLocationPress = () => {
    setLocationModalVisible(true);
  };

  const handleLocationSelect = (type: 'city' | 'village') => {
    setLocationType(type);
  };

  const handleLocationConfirm = () => {
    setLocationModalVisible(false);
    setLocation(`${locationType === 'city' ? 'City' : 'Village'}: ${locationName}`);
  };

  // Autocomplete logic for location name
  const handleLocationNameChange = (text: string) => {
    setLocationName(text);
    let source = locationType === 'city' ? cities : villages;
    if (locationType && text.length > 0) {
      setSuggestions(source.filter(name => name.toLowerCase().startsWith(text.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (name: string) => {
    setLocationName(name);
    setSuggestions([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Post a Job</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Job Title"
        placeholderTextColor={colors.placeholder}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <View style={styles.pickerWrapper}>
        <select
          style={styles.picker}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, height: 80 }]}
        placeholder="Description"
        placeholderTextColor={colors.placeholder}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {/* Location Picker */}
      <Text style={[styles.label, { color: colors.text }]}>Location</Text>
      <TouchableOpacity onPress={handleLocationPress} style={[styles.input, { justifyContent: 'center' }]}> 
        <Text style={{ color: location ? colors.text : colors.placeholder }}>
          {location ? location : 'Select City or Village'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.label, { color: colors.text, fontWeight: 'bold' }]}>Choose Location Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                style={[styles.typeButton, locationType === 'city' && styles.typeButtonSelected]}
                onPress={() => handleLocationSelect('city')}
              >
                <Text style={{ color: colors.text }}>City</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, locationType === 'village' && styles.typeButtonSelected]}
                onPress={() => handleLocationSelect('village')}
              >
                <Text style={{ color: colors.text }}>Village</Text>
              </TouchableOpacity>
            </View>
            {locationType && (
              <>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  placeholder={`Enter ${locationType === 'city' ? 'City' : 'Village'} Name`}
                  placeholderTextColor={colors.placeholder}
                  value={locationName}
                  onChangeText={handleLocationNameChange}
                  autoCorrect={false}
                  autoCapitalize="words"
                />
                {suggestions.length > 0 && (
                  <View style={styles.suggestionsBox}>
                    {suggestions.map((s, idx) => (
                      <TouchableOpacity
                        key={s + idx}
                        onPress={() => handleSuggestionSelect(s)}
                        style={styles.suggestionItem}
                      >
                        <Text style={{ color: colors.text }}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
            <Button title="Confirm" onPress={handleLocationConfirm} disabled={!locationType || !locationName} />
            <Button title="Cancel" onPress={() => setLocationModalVisible(false)} color="#999" />
          </View>
        </View>
      </Modal>
      <Button title={loading ? 'Posting...' : 'Post Job'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  pickerWrapper: {
    marginBottom: 14,
  },
  picker: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  typeButtonSelected: {
    backgroundColor: '#e0eaff',
    borderColor: '#007bff',
  },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: -10,
    marginBottom: 10,
    width: '100%',
    maxHeight: 120,
    zIndex: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
