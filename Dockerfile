FROM node:20

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package-Dateien kopieren und Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm install --only=production

# Quellcode kopieren
COPY . .

# Port freigeben
EXPOSE 3000

# Startbefehl für die API
CMD ["node", "dist/main.js"]
