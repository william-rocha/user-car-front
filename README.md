# CarControlWeb

Projeto gerado com [Angular CLI](https://github.com/angular/angular-cli) version 16.1.8.

## Instalar pacotes

Rode `npm install`

## Rodar aplicação em Desenvolvimento

Rode `ng serve`

## Observações:

- Ao criar um motorista e um carro, ambos ficam com o status "Disponível".
- Adicionar um motorista e um carro em um "Registro de Uso" altera seus status para "Em uso".
- Ao finalizar o "Registro de Uso", os status de ambos voltam a ser "Disponível".
- Para deletar um "Carro" ou "Motorista", ambos devem ter status "Disponível" (sem "Registro de Uso" em andamento).
- Ao adicionar um novo "Registro de Uso", apenas motoristas e carros disponíveis serão exibidos para registro.
- Ao deletar um motorista que já teve algum "registro de uso" finalizado, seus campos ficarão cinzas e o status mudará para "Funcionário desligado" na lista de "Registro de Uso".
- Ao deletar um carro que já teve algum "registro de uso" finalizado, seus campos ficarão cinzas e o status mudará para "Saiu da frota" na lista de "Registro de Uso".
