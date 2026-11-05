import React, { useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Switch, Alert, Linking
} from "react-native";

const destinations = [
  { id: "1", name: "Kurukshetra", state: "Haryana", distance: "Nearby trip", cost: 450, note: "Museums, heritage and public places" },
  { id: "2", name: "Chandigarh", state: "Chandigarh", distance: "Day trip", cost: 700, note: "Gardens, lakeside walk and public spaces" },
  { id: "3", name: "Rishikesh", state: "Uttarakhand", distance: "Short trip", cost: 950, note: "Ganga ghats and public areas" },
  { id: "4", name: "Amritsar", state: "Punjab", distance: "Longer trip", cost: 1000, note: "Heritage sites and community spaces" },
];

const money = (n) => `₹${Math.max(0, Number(n) || 0).toLocaleString("en-IN")}`;

function Field({ label, value, onChangeText, hint }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={String(value)}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder={hint || "0"}
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
    </View>
  );
}

function Pill({ children, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [tab, setTab] = useState("planner");
  const [budget, setBudget] = useState("1000");
  const [outbound, setOutbound] = useState("150");
  const [returnFare, setReturnFare] = useState("150");
  const [food, setFood] = useState("150");
  const [emergency, setEmergency] = useState("200");
  const [visit, setVisit] = useState("100");
  const [returnVerified, setReturnVerified] = useState(false);
  const [selected, setSelected] = useState("1");
  const [saved, setSaved] = useState([]);

  const total = useMemo(() =>
    [outbound, returnFare, food, emergency, visit]
      .reduce((sum, v) => sum + (Number(v) || 0), 0), 
    [outbound, returnFare, food, emergency, visit]
  );
  const remaining = (Number(budget) || 0) - total;
  const canRecommend = remaining >= 0 && returnVerified;

  const chosen = destinations.find(d => d.id === selected) || destinations[0];

  const openMap = (name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
    Linking.openURL(url).catch(() => Alert.alert("Maps unavailable", "Please open Google Maps manually."));
  };

  const toggleSaved = (id) => {
    setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SafarSuraksha</Text>
          <Text style={styles.tagline}>Pehle ghar wapsi pakki, phir safar</Text>
        </View>
        <Text style={styles.logo}>↗</Text>
      </View>

      <View style={styles.tabs}>
        <Pill active={tab === "planner"} onPress={() => setTab("planner")}>Budget Plan</Pill>
        <Pill active={tab === "places"} onPress={() => setTab("places")}>Places</Pill>
        <Pill active={tab === "saved"} onPress={() => setTab("saved")}>Saved</Pill>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "planner" && <>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Travel smart. Return assured.</Text>
            <Text style={styles.heroText}>Safar plan karne se pehle return fare aur emergency reserve alag rakho.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Your total budget</Text>
            <Field label="Total available budget (₹)" value={budget} onChangeText={setBudget} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2. Return-first expense plan</Text>
            <Text style={styles.helper}>Return fare aur emergency reserve ko pehle calculate karo.</Text>
            <Field label="Outbound travel (₹)" value={outbound} onChangeText={setOutbound} />
            <Field label="Return travel (₹)" value={returnFare} onChangeText={setReturnFare} />
            <Field label="Food and water (₹)" value={food} onChangeText={setFood} />
            <Field label="Emergency reserve (₹)" value={emergency} onChangeText={setEmergency} />
            <Field label="Visiting / other expense (₹)" value={visit} onChangeText={setVisit} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3. Confirm return journey</Text>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Return service and timing checked?</Text>
                <Text style={styles.helper}>Official bus/train source par actual fare aur timing verify karein.</Text>
              </View>
              <Switch value={returnVerified} onValueChange={setReturnVerified} />
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Your trip calculation</Text>
            <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Total planned expenses</Text><Text style={styles.summaryValue}>{money(total)}</Text></View>
            <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Budget remaining</Text><Text style={[styles.summaryValue, remaining < 0 && { color: "#B91C1C" }]}>{remaining < 0 ? `-${money(Math.abs(remaining))}` : money(remaining)}</Text></View>
            <View style={[styles.status, canRecommend ? styles.statusGood : styles.statusWarn]}>
              <Text style={styles.statusText}>
                {remaining < 0
                  ? "Budget exceeded — trip plan ko adjust karein."
                  : !returnVerified
                    ? "Return journey verify karein. Abhi trip recommendation locked hai."
                    : "Budget calculation passed — details ek baar phir verify karein."}
              </Text>
            </View>
            <Text style={styles.disclaimer}>Important: Ye estimate hai, safety guarantee nahi. Actual fares, service availability, timings, weather aur local conditions khud verify karein. Emergency reserve ko sightseeing par spend na karein.</Text>
          </View>
        </>}

        {tab === "places" && <>
          <Text style={styles.pageTitle}>Budget-friendly ideas</Text>
          <Text style={styles.helper}>Sample estimates only. Apne starting point se actual fare check karein.</Text>
          {destinations.map(d => (
            <TouchableOpacity key={d.id} style={[styles.placeCard, selected === d.id && styles.placeSelected]} onPress={() => setSelected(d.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.placeName}>{d.name}, {d.state}</Text>
                <Text style={styles.helper}>{d.distance} · {d.note}</Text>
                <Text style={styles.placeCost}>Illustrative starting estimate: {money(d.cost)}</Text>
              </View>
              <Text style={styles.selectMark}>{selected === d.id ? "●" : "○"}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.primaryButton} onPress={() => openMap(`${chosen.name}, ${chosen.state}`)}>
            <Text style={styles.primaryButtonText}>Open selected place in Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setTab("planner")}>
            <Text style={styles.secondaryButtonText}>Plan this trip</Text>
          </TouchableOpacity>
        </>}

        {tab === "saved" && <>
          <Text style={styles.pageTitle}>Saved places</Text>
          {saved.length === 0 ? <Text style={styles.empty}>Abhi koi place save nahi hai. Places tab se save kar sakte hain.</Text> :
            destinations.filter(d => saved.includes(d.id)).map(d => (
              <View key={d.id} style={styles.placeCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.placeName}>{d.name}, {d.state}</Text>
                  <Text style={styles.helper}>{d.note}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleSaved(d.id)}><Text style={styles.remove}>Remove</Text></TouchableOpacity>
              </View>
            ))
          }
          <Text style={styles.helper}>Tip: Places tab mein kisi destination ko select karke save option use karein.</Text>
        </>}
      </ScrollView>

      {tab === "places" && (
        <View style={styles.bottomAction}>
          <TouchableOpacity style={styles.saveButton} onPress={() => toggleSaved(selected)}>
            <Text style={styles.saveButtonText}>{saved.includes(selected) ? "Remove from saved" : "☆ Save selected place"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F6FB" },
  header: { backgroundColor: "#123B5D", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#FFFFFF", fontSize: 25, fontWeight: "800" },
  tagline: { color: "#CDE7F5", marginTop: 4, fontSize: 12 },
  logo: { color: "#FFFFFF", fontSize: 30, fontWeight: "800" },
  tabs: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#FFFFFF" },
  pill: { paddingVertical: 9, paddingHorizontal: 15, borderRadius: 22, backgroundColor: "#E8EEF5" },
  pillActive: { backgroundColor: "#123B5D" },
  pillText: { color: "#35516A", fontWeight: "700" },
  pillTextActive: { color: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 30 },
  hero: { backgroundColor: "#DCEFF5", padding: 18, borderRadius: 18, marginBottom: 14 },
  heroTitle: { color: "#123B5D", fontSize: 21, fontWeight: "800" },
  heroText: { color: "#35516A", marginTop: 7, lineHeight: 20 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 13 },
  sectionTitle: { fontSize: 17, color: "#173B59", fontWeight: "800", marginBottom: 10 },
  helper: { color: "#64748B", fontSize: 12, lineHeight: 18, marginBottom: 8 },
  field: { marginTop: 9 },
  label: { color: "#334155", fontWeight: "600", marginBottom: 6, fontSize: 13 },
  input: { borderWidth: 1, borderColor: "#D6E0EA", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "#102A43", backgroundColor: "#FAFCFE", fontSize: 16 },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  switchTitle: { color: "#1E293B", fontWeight: "700" },
  summary: { backgroundColor: "#FFFFFF", padding: 17, borderRadius: 16, marginBottom: 16 },
  summaryTitle: { color: "#123B5D", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
  summaryLabel: { color: "#475569" },
  summaryValue: { color: "#123B5D", fontWeight: "800" },
  status: { padding: 12, borderRadius: 10, marginTop: 12 },
  statusGood: { backgroundColor: "#DCFCE7" },
  statusWarn: { backgroundColor: "#FEF3C7" },
  statusText: { color: "#1F2937", fontWeight: "700", lineHeight: 20 },
  disclaimer: { color: "#64748B", fontSize: 11, lineHeight: 17, marginTop: 12 },
  pageTitle: { color: "#123B5D", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  placeCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 15, marginVertical: 6, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  placeSelected: { borderColor: "#168AAD", borderWidth: 2 },
  placeName: { color: "#123B5D", fontSize: 16, fontWeight: "800", marginBottom: 4 },
  placeCost: { color: "#0F766E", fontWeight: "700", fontSize: 12, marginTop: 5 },
  selectMark: { color: "#168AAD", fontSize: 22, paddingLeft: 10 },
  primaryButton: { backgroundColor: "#123B5D", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 12 },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800" },
  secondaryButton: { padding: 13, alignItems: "center" },
  secondaryButtonText: { color: "#123B5D", fontWeight: "800" },
  bottomAction: { padding: 12, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderColor: "#E2E8F0" },
  saveButton: { backgroundColor: "#E0F2FE", padding: 13, borderRadius: 12, alignItems: "center" },
  saveButtonText: { color: "#075985", fontWeight: "800" },
  empty: { backgroundColor: "#FFFFFF", padding: 18, borderRadius: 12, color: "#64748B", lineHeight: 21, marginVertical: 10 },
  remove: { color: "#B91C1C", fontWeight: "700" },
});
