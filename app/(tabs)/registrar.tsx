import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Botao } from "../../src/components/Botao";
import { salvarOcorrencia } from "../../src/db";
import { cores, fonte } from "../../src/theme";
import { TIPOS, TipoOcorrencia } from "../../src/types";

export default function Registrar() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null);
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  const pronto = tipo !== null && local.trim().length >= 3;

  async function enviar() {
    if (!tipo) {
      setMensagem("Escolha o tipo de problema.");
      return;
    }
    if (local.trim().length < 3) {
      setMensagem("Diga onde é (rua ou ponto de referência).");
      return;
    }
    setSalvando(true);
    try {
      await salvarOcorrencia(tipo, local, descricao);
      setTipo(null);
      setLocal("");
      setDescricao("");
      setMensagem("Pronto! Seu aviso foi salvo no seu celular.");
      router.push("/historico");
    } catch {
      setMensagem("Não foi possível salvar. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.rotulo}>1. Qual é o problema?</Text>
        {TIPOS.map((t) => (
          <Pressable
            key={t.valor}
            accessibilityRole="radio"
            accessibilityLabel={t.rotulo}
            accessibilityState={{ selected: tipo === t.valor }}
            onPress={() => setTipo(t.valor)}
            style={[estilos.opcao, tipo === t.valor && estilos.opcaoSel]}
          >
            <View style={[estilos.radio, tipo === t.valor && estilos.radioSel]} />
            <Text style={estilos.textoOpcao}>{t.rotulo}</Text>
          </Pressable>
        ))}

        <Text style={estilos.rotulo}>2. Onde é?</Text>
        <TextInput
          style={estilos.campo}
          value={local}
          onChangeText={setLocal}
          placeholder="Ex.: Rua das Flores, perto da ponte"
          placeholderTextColor="#6B7186"
          accessibilityLabel="Local do problema"
          returnKeyType="next"
        />

        <Text style={estilos.rotulo}>3. Quer contar mais? (opcional)</Text>
        <TextInput
          style={[estilos.campo, { minHeight: 100, textAlignVertical: "top" }]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex.: a água já chegou na calçada"
          placeholderTextColor="#6B7186"
          multiline
          accessibilityLabel="Descrição do problema, opcional"
        />

        {mensagem !== "" && (
          <Text accessibilityLiveRegion="polite" style={estilos.mensagem}>{mensagem}</Text>
        )}
        <Botao titulo={salvando ? "Salvando..." : "Salvar aviso"} aoPressionar={enviar} desabilitado={salvando || !pronto} dica="Guarda o aviso neste celular" />
        <Text style={estilos.suave}>Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros).</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 12 },
  rotulo: { fontSize: 20, fontWeight: "800", color: cores.texto, marginTop: 8 },
  opcao: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: cores.cartao, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16 },
  opcaoSel: { borderColor: cores.primaria, borderWidth: 3 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: cores.suave },
  radioSel: { borderColor: cores.primaria, backgroundColor: cores.primaria },
  textoOpcao: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600" },
  campo: { minHeight: 56, backgroundColor: cores.cartao, borderRadius: 12, borderWidth: 1, borderColor: cores.borda, paddingHorizontal: 16, paddingVertical: 12, fontSize: fonte.corpo, color: cores.texto },
  mensagem: { fontSize: fonte.corpo, color: cores.texto, fontWeight: "600" },
  suave: { fontSize: 16, color: cores.suave },
});
