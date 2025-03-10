interface CategorieData {
    [key: string]: string;
}
const currentCategorieData: CategorieData = {
    NUMIS0: "Numismática",
    NUMIS1: "Moedas",
    NUMIS2: "Moedas Antigas",
    NUMIS3: "Moedas Comemorativas",
    NUMIS4: "Medalhas",
    NUMIS5: "Medalhas Históricas",
    NUMIS6: "Medalhas Comemorativas",
    NUMIS7: "Cédulas",
    NUMIS8: "Cédulas Brasileiras",
    NUMIS9: "Cédulas Estrangeiras",
    ART0: "Artes",
    ART1: "Pinturas",
    ART2: "Pinturas Clássicas",
    ART3: "Pinturas Modernas",
    ART4: "Pinturas Contemporâneas",
    ART5: "Esculturas Clássicas",
    ART6: "Esculturas Modernas",
    ART7: "Esculturas Contemporâneas",
    ART8: "Arte Dramática",
    ART9: "Esculturas",
    JOIA0: "Joias",
    JOIA1: "Braceletes",
    JOIA2: "Anéis",
    JOIA3: "Colares",
    JOIA4: "Bijuterias",
    MOVI0: "Móveis Decoração",
    MOVI1: "Móveis Antigos",
    MOVI2: "Decoração Vintage",
    MOVI3: "Lustres",
    MOVI4: "Espelhos",
    MOVI5: "Cadeiras",
    MOVI6: "Mesas",
    MOVI7: "Bancos",
    MOVI8: "Estofados",
    MOVI9: "Decorações",
    LIVR0: "Livros",
    LIVR1: "Primeiras Edições",
    LIVR2: "Livros Autografados",
    LIVR3: "Manuscritos Históricos",
    LIVR4: "Revistas",
    BRIN0: "Brinquedos_Jogos",
    BRIN1: "Brinquedos Vintage",
    BRIN2: "Jogos de Tabuleiro Antigos",
    BRIN3: "Trens e Ferrovias em Miniatura",
    MIL0: "Militaria",
    MIL1: "Uniformes Militares",
    MIL2: "Medalhas e Insígnias",
    MIL3: "Armas Antigas",
    MIL4: "Artefatos ",
    MIL5: "Explosivos",
    CERPOR0: "Cerâmica e porcelana",
    CERPOR1: "Cerâmica Antiga",
    CERPOR2: "Porcelana Antiga",
    CERPOR3: "Cerâmica Moderna",
    CERPOR4: "Porcelana Moderna",
    CERPOR5: "Porcelana Decorativa",
    BEBIS0: "Bebidas, Vinhos e Destilados",
    BEBIS1: "Vinhos Raros",
    BEBIS2: "Destilados Antigos",
    BEBIS3: "Cervejas Artesanais",
    BEBIS4: "Bebidas Naturais",
    BEBIS5: "Refrigerantes",
    BEBIS6: "Liqueuras",
    BEBIS7: "Bebidas de Cola e Limão",
    VEHI0: "Veículos",
    VEHI1: "Carros Antigos",
    VEHI2: "Carros Modernos",
    VEHI3: "Motos Antigas",
    VEHI4: "Motos Modernas",
    VEHI5: "Bicicletas Vintage",
    MUSI0: "Música",
    MUSI1: "Discos de Vinil",
    MUSI2: "CDs",
    MUSI3: "Instrumentos Musicais",
    MUSI4: "Merchandise de Bandas e Músicos",
    MUSI5: "Palhetas",
    MUSI6: "Manuscritos musicais antigos",
    FOTO0: "Fotografia e Equipamentos",
    FOTO1: "Câmeras Fotográficas",
    FOTO2: "Lentes de Câmeras",
    FOTO3: "Tripés e Estabilizadores",
    FOTO4: "Acessórios de Câmera",
    FOTO5: "Iluminação e Flash",
    FOTO6: "Armazenamento e Mídia",
    FOTO7: "Software de Edição",
    FOTO8: "Equipamentos de Áudio para Vídeo",
    FOTO9: "Baterias e Carregadores",
    FOTO10: "Bolsa e Mochilas para Câmera",
    MODA0: "Moda e Acessórios",
    MODA1: "Roupas Históricas",
    MODA2: "Acessórios Vintage",
    MODA3: "Moda Contemporânea",
    MODA4: "Roupas de Designer",
    MODA5: "Calçados",
    MODA6: "Bolsas e Carteiras",
    MODA7: "Joias e Bijuterias",
    MODA8: "Óculos de Sol e Óculos de Grau",
    MODA9: "Moda Sustentável",
    MODA10: "Moda Infantil",
    ESPOR0: "Esportes",
    ESPOR1: "Cartões de Esportes",
    ESPOR2: "Memorabilia Esportiva",
    ESPOR3: "Equipamentos de Esporte",
    ESPOR4: "Roupas e Acessórios Esportivos",
    ESPOR5: "Calçados Esportivos",
    ESPOR6: "Colecionáveis de Esportes",
    ESPOR7: "Livros e Revistas de Esportes",
    ESPOR8: "Artigos de Treinamento e Fitness",
    ESPOR9: "Produtos de Nutrição Esportiva",
    ESPOR10: "Troféus e Medalhas de competição esportiva",
    CULT0: "Cultura Pop",
    CULT1: "Figuras de Ação de Filmes e Séries",
    CULT2: "Produtos de Filmes e Séries",
    CULT3: "Itens de Eventos e Convenções",
    DISP0: "Dispositivos e Aparelhos Eletrônicos",
    DISP1: "Computadores Antigos",
    DISP2: "Consoles de Videogame",
    DISP3: "Televisores e Monitores",
    DISP4: "Equipamentos de Áudio",
    DISP5: "Câmeras e Gravadores",
    DISP6: "Acessórios Eletrônicos",
    DISP7: "Electrodomésticos Vintage",
    DISP8: "Rádios e Transmissores",
    DISP9: "Equipamentos de Rede e Comunicação",
    DISP10: "Dispositivos Móveis Antigos",
    MINI0: "Miniaturas",
    MINI1: "Miniaturas Automotivas",
    MINI2: "Trens e Ferrovias em Miniatura",
    MINI3: "Miniaturas de Aviões",
    MINI4: "Miniaturas de Barcos",
    MINI5: "Miniaturas de Edifícios e Monumentos",
    MINI6: "Miniaturas de Figuras e Personagens",
    MINI7: "Miniaturas de Animais",
    MINI8: "Miniaturas de Modelos Históricos",
    MINI9: "Miniaturas de Brinquedos Antigos",
    MINI10: "Miniaturas de Robôs e Drones",
    GAME0: "Videogames",
    GAME1: "Consoles e Controllers",
    GAME2: "Jogos de Videogame",
    GAME3: "Acessórios para Consoles",
    GAME4: "Memórias e Cartões de Expansão",
    GAME5: "Videogames Retro",
    GAME6: "Consoles Portáteis",
    GAME7: "Figuras e Colecionáveis de Jogos",
    GAME8: "Equipamentos de Realidade Virtual",
    GAME9: "Manuais e Guias de Jogos",
    GAME10: "Joysticks e Volantes",
    NUMI0: "Numismática",
    NUMI1: "Moedas Antigas",
    NUMI2: "Notas de Banco Raras",
    NUMI3: "Moedas de Ouro e Prata",
    NUMI4: "Moedas Comemorativas",
    NUMI5: "Moedas de Papel",
    NUMI6: "Medalhas e Distintivos",
    NUMI7: "Moedas de Coleção por País",
    NUMI8: "Moedas de Edificações Históricas",
    NUMI9: "Conjuntos de Moedas",
    NUMI10: "Estudos e Catálogos Numismáticos",
    RELOG0: "Relógios",
    RELOG1: "Relógios de Pulso",
    RELOG2: "Relógios de Bolsas",
    RELOG3: "Relógios de Luxo",
    RELOG4: "Relógios Vintage",
    RELOG5: "Relógios Esportivos",
    RELOG6: "Relógios de Mergulho",
    RELOG7: "Relógios de Sobrevivência e Aventura",
    RELOG8: "Relógios de Fabricação Especial",
    RELOG9: "Relógios de Coleção por Marca",
    RELOG10: "Acessórios para Relógios",
    GRAV0: "Gravuras",
    GRAV1: "Serigrafias",
    GRAV2: "Xilogravuras",
    GRAV3: "Litografias",
    GRAV4: "Agravuras",
    GRAV5: "Mezzotintos",
    GRAV6: "Drypoints",
    GRAV7: "Gravuras em Metal",
    GRAV8: "Gravuras em Madeira",
    GRAV9: "Gravuras Contemporâneas",
    GRAV10: "Gravuras Raras e Antigas",
    CINE0: "Cinema",
    CINE1: "Memorabilia de Filmes",
    CINE2: "Roteiros Autografados",
    CINE3: "Posters de Filmes",
    CINE4: "Figurinos de Filmes",
    CINE5: "Cenas Cortadas e Edição",
    CINE6: "Câmeras de Cinema Antigas",
    CINE7: "Itens de Produção",
    CINE8: "Fotografias de Bastidores",
    CINE9: "Prêmios e Troféus de Cinema",
    ANTG0: "Artefatos da Antiguidade",
    ANTG1: "Artefatos Arqueológicos",
    ANTG2: "Objetos de Guerra",
    ANTG3: "Relíquias Históricas",
    ANTG4: "Artefatos de Madeira Antiga",
    ANTG5: "Artefatos de Luxo Antigo",
    ANTG6: "Artefatos de Metal Antigo",
    ANTG7: "Artefatos de Cerâmica Antiga",
    ANTG8: "Artefatos de Vidro Antigo",
    ANTG9: "Instrumentos Musicais Antigos",
}


const categorieLibraryConvert = (categorie: string) => {
    if (categorie in currentCategorieData) {
        return currentCategorieData[categorie];
    }
    return null;
};

export { categorieLibraryConvert, currentCategorieData }