export const COURSE = {
  id: "techinclusao",
  modules: [
    {
      id: "word",
      ordem: 1,
      titulo: "Microsoft Word",
      resumo: "Produção documental profissional.",
      lessons: [
        { id: "word-01", ordem: 1, titulo: "Introdução ao Word" },
        { id: "word-02", ordem: 2, titulo: "Formatação Essencial" },
        { id: "word-03", ordem: 3, titulo: "Elementos Visuais" },
        { id: "word-04", ordem: 4, titulo: "Estrutura Avançada" },
        { id: "word-05", ordem: 5, titulo: "Revisão e Exportação" },
      ],
    },
    {
      id: "excel",
      ordem: 2,
      titulo: "Microsoft Excel",
      resumo: "Organização e lógica de dados.",
      lessons: [
        { id: "excel-01", ordem: 1, titulo: "Fundamentos da Planilha" },
        { id: "excel-02", ordem: 2, titulo: "Formatação e Apresentação" },
        { id: "excel-03", ordem: 3, titulo: "Cálculos e Fórmulas" },
        { id: "excel-04", ordem: 4, titulo: "Funções Essenciais" },
        { id: "excel-05", ordem: 5, titulo: "Visualização" },
      ],
    },
    {
      id: "ppt",
      ordem: 3,
      titulo: "PowerPoint",
      resumo: "Apresentações dinâmicas.",
      lessons: [
        { id: "ppt-01", ordem: 1, titulo: "Planejamento Visual" },
        { id: "ppt-02", ordem: 2, titulo: "Inserção de Conteúdo" },
        { id: "ppt-03", ordem: 3, titulo: "Organização Global" },
        { id: "ppt-04", ordem: 4, titulo: "Dinamismo" },
        { id: "ppt-05", ordem: 5, titulo: "Apresentação" },
      ],
    },
    {
      id: "html5",
      ordem: 4,
      titulo: "HTML5",
      resumo: "Estruturação semântica da web.",
      lessons: [
        { id: "html5-01", ordem: 1, titulo: "A Web" },
        { id: "html5-02", ordem: 2, titulo: "Hierarquia de Texto" },
        { id: "html5-03", ordem: 3, titulo: "Organização e Navegação" },
        { id: "html5-04", ordem: 4, titulo: "Multimídia" },
        { id: "html5-05", ordem: 5, titulo: "Coleta de Dados" },
      ],
    },
    {
      id: "css3",
      ordem: 5,
      titulo: "CSS3",
      resumo: "Estilização e layout visual.",
      lessons: [
        { id: "css3-01", ordem: 1, titulo: "Estilo na Web" },
        { id: "css3-02", ordem: 2, titulo: "Seletores, Cores, Tipografia" },
        { id: "css3-03", ordem: 3, titulo: "O Modelo de Caixas" },
        { id: "css3-04", ordem: 4, titulo: "Layout com Flexbox" },
        { id: "css3-05", ordem: 5, titulo: "Responsividade" },
      ],
    },
  ],
};

export function findLesson(moduleId, lessonId) {
  const courseModule = COURSE.modules.find((item) => item.id === moduleId);
  const lesson = courseModule?.lessons.find((item) => item.id === lessonId);
  return { courseModule, lesson };
}
