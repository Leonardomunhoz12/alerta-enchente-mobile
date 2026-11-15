import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { buscarRegiao } from "../../src/api";
import { Farol } from "../../src/components/Farol";
import { calcularNivel, formatarHora } from "../../src/risco";
import { cores, fonte } from "../../src/theme";
import { Regiao } from "../../src/types";

export default function DetalheRegiao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [regiao, setRegiao] = useState<Regiao | undefined | null>(null);

  useEffect(() => {
    buscarRegiao(String(id)).then(setRegiao).catch(() => setRegiao(undefined));
  }, [id]);

  if (regiao === null) return <ActivityIndicator style={{ flex: 1 }} size="large" color={cores.primaria} />;
  if (!regiao) return <Text style={estilos.texto}>Região não encontrada.</Text>;

  const nivel = calcularNivel(regiao);
  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Stack.Screen options={{ title: regiao.nome }} />
      <Farol nivel={nivel} grande />
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>O que fazer</Text>
        <Text style={estilos.texto}>{regiao.orientacao}</Text>
      </View>
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>Níveis do {regiao.corrego}</Text>
        <Text style={estilos.texto}>Agora: {regiao.nivelCm} cm</Text>
        <Text style={estilos.texto}>Atenção a partir de: {regiao.cotaAlertaCm} cm</Text>
        <Text style={estilos.texto}>Perigo a partir de: {regiao.cotaEmergenciaCm} cm</Text>
        <Text style={estilos.suave}>Atualizado em {formatarHora(regiao.atualizadoEm)}</Text>
      </View>
      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>Telefones úteis</Text>
        <Text style={estilos.texto}>Defesa Civil: 199</Text>
        <Text style={estilos.texto}>Bombeiros: 193</Text>
        <Text style={estilos.texto}>SAMU: 192</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, gap: 14 },
  cartao: { backgroundColor: cores.cartao, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, padding: 16, gap: 8 },
  rotulo: { fontSize: 14, fontWeight: "700", color: cores.suave, textTransform: "uppercase", letterSpacing: 0.6 },
  texto: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 26 },
  suave: { fontSize: 16, color: cores.suave },
});
