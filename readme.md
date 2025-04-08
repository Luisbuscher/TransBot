![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

# Depencencies

## .env:
### Deve criar um arquivo .env e ele deve conter as seguintes informações
    <!-- Dados do login -->
    USER=
    PASSWORD=
    <!-- link do cadastro de estudante -->
    LINK_ESTUDANTE 

## Instalar as dependencias do projeto:
### Basta instalar as bibliotecas necessarias com o seguinte comando:
    npm install

## Ter a pasta chromium do Puppeter na raiz do projeto:
    /chromium
        /chrome-win64
            files

## Criar Executavel:
    npx electron-packager . BotElectron --platform=win32 --arch=x64 --out=dist --overwrite
## Criar instalador:
### Deve ser criado após criar o executavel: Recomendado rodar como adm no terminal
    npm run dist <!-- Cria o executavel na pasta dist -->
Sera criada uma pasta chamada "dist", nela estara o executavel.