const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const replacements = [
    { bad: "ðŸ”‘", good: "🔑" },
    { bad: "ðŸ“ ", good: "📝" },
    { bad: "ðŸ‘¨â€ ðŸ «", good: "👨‍🏫" },
    { bad: "ðŸ‘¨â€ ðŸŽ“", good: "👨‍🎓" },
    { bad: "ðŸ  ", good: "🐍" },
    { bad: "ðŸ“š", good: "📚" },
    { bad: "ðŸ’›", good: "💛" },
    { bad: "ðŸ“Š", good: "📊" },
    { bad: "ðŸ”’", good: "🔒" },
    { bad: "ðŸ“¢", good: "📢" },
    { bad: "ðŸ’¼", good: "💼" },
    { bad: "ðŸ¤–", good: "🤖" },
    { bad: "ðŸ” ", good: "🔍" },
    { bad: "ðŸš€", good: "🚀" },
    { bad: "ðŸ †", good: "🏆" },
    { bad: "ðŸŽ“", good: "🎓" },
    { bad: "ðŸ‘¥", good: "👥" },
    { bad: "ðŸšª", good: "🚪" },
    { bad: "ðŸ“ˆ", good: "📈" },
    { bad: "ðŸŽ¯", good: "🎯" },
    { bad: "ðŸ”„", good: "🔄" },
    { bad: "ðŸ’¾", good: "💾" },
    { bad: "ðŸ“‹", good: "📋" },
    { bad: "âž”", good: "➔" },
    { bad: "âœ”", good: "✔" }
];

let totalReplaced = 0;

for (const file of files) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const rep of replacements) {
        if (content.includes(rep.bad)) {
            content = content.split(rep.bad).join(rep.good);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed icons in: ${file}`);
        totalReplaced++;
    }
}

console.log(`Successfully fixed icons in ${totalReplaced} files!`);
