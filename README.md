# Sistema de Controle de Acesso - Frontend

Frontend minimalista em React + Tailwind CSS para o sistema de controle de acesso de veículos, desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC).

## Principais Funcionalidades

- Login com autenticação JWT
- Dashboards distintos para usuário normal e administrador
- Gestão de veículos do usuário (adicionar, editar, visualizar, imagem)
- Upload e visualização de imagem do veículo
- Histórico de acessos do usuário (todos os carros ou por carro)
- Dashboard de administrador com listagem, edição e exclusão de usuários
- Histórico total de acessos (admin), com filtros de data e usuário
- Interface responsiva e minimalista
- Página 404 personalizada

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)
- [react-hot-toast](https://react-hot-toast.com/)
- [react-icons](https://react-icons.github.io/react-icons/)

## Instale as dependências:

```bash
npm install
# ou
yarn install
```

## Crie um arquivo .env na raiz do projeto e adicione:
```bash
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
```

## Rode o projeto em modo desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Acesse:
[http://localhost:5173](http://localhost:5173) (ou a porta informada pelo terminal)

# Estrutura de Pastas:
```plaintext
src/
  pages/
    AdminDashboard.tsx
    UserDashboard.tsx
    Login.tsx
    UserManagementPage.tsx
    UserEditPage.tsx
    TotalAccessHistoryPage.tsx
    UserAccessHistoryPage.tsx
    CarFormPage.tsx
    CarEditPage.tsx
  App.tsx
  main.tsx
  index.css
```

## Observações
- Para funcionamento pleno, o backend deve estar rodando e acessível no endereço definido no `.env`.
- Certifique-se de que a variável `VITE_API_BASE_URL` aponta para a URL correta da API.
- Consulte a documentação do backend para instruções de instalação e execução.
- Em caso de erro de conexão, verifique se o backend está ativo e se não há bloqueios de firewall.


## Telas implementadas
- Login
- Dashboard usuário
- Dashboard admin
- Cadastro e edição de carro
- Histórico de acessos (usuário)
- Histórico total de acessos (admin)
- Listagem, edição e exclusão de usuários (admin)
- Página 404 customizada


# Licença
Uso acadêmico. Projeto desenvolvido para fins de TCC.

