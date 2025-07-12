# Uge Skema - H2 Forløb Database

En moderne og responsiv web-applikation der viser ugeprogrammer for H2 Forløb. Systemet finder automatisk den aktuelle uge baseret på enhedens dato og viser det relevante program.

## Funktioner

- 🗓️ **Automatisk uge-detektering**: Finder den aktuelle eller næste tilgængelige uge
- 📱 **Responsivt design**: Fungerer perfekt på alle enheder
- 🎨 **Moderne UI**: Flot gradient baggrund og glassmorphism effekter
- ⚡ **Interaktiv navigation**: Skift mellem uger med knapper og dropdown
- 📊 **Visuel feedback**: Forskellige farver for tomme tider og fridage
- 🔄 **Real-time opdateringer**: Indlæser data dynamisk fra JSON-fil

## Sådan bruger du det

1. **Åbn `index.html`** i din browser
2. Systemet indlæser automatisk ugeprogrammet fra `data/schedule.json`
3. Den aktuelle uge vises automatisk baseret på dagens dato
4. Brug navigationsknapperne eller dropdown-menuen til at skifte mellem uger

## Filstruktur

```
InfoScreen/
├── index.html          # Hovedside med moderne HTML-struktur
├── styles.css          # Moderne CSS med gradient og glassmorphism
├── script.js           # JavaScript-logik for ugeprogram-visning
├── data/
│   └── schedule.json   # Ugeprogram data i JSON-format
└── README.md           # Denne fil
```

## JSON Data Format

Ugeprogrammet er struktureret i `data/schedule.json` med følgende format:

```json
{
  "weeks": {
    "3": {
      "dates": {
        "start": "2025-08-18",
        "end": "2025-08-22"
      },
      "monday": {
        "08:00-09:30": "Aktivitet beskrivelse",
        "10:00-11:30": "Anden aktivitet"
      }
      // ... andre dage
    }
  },
  "metadata": {
    "lastUpdated": "2024-01-15",
    "version": "1.0",
    "description": "H2 Forløb Ugeprogram Database"
  }
}
```

## Tekniske detaljer

- **HTML5**: Semantisk markup med moderne struktur
- **CSS3**: Flexbox, Grid, og CSS-variabler for responsivt design
- **JavaScript ES6+**: Async/await, klasser og moderne DOM-manipulation
- **Font Awesome**: Ikoner for bedre brugeroplevelse
- **Google Fonts**: Inter font for moderne typografi

## Browser kompatibilitet

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Udvikling

For at tilføje nye uger eller opdatere eksisterende:

1. Rediger `data/schedule.json`
2. Tilføj nye uger i `weeks` objektet
3. Opdater `metadata.lastUpdated` dato
4. Genindlæs siden i browseren

Systemet vil automatisk opdage nye uger og tilføje dem til navigationsmulighederne.