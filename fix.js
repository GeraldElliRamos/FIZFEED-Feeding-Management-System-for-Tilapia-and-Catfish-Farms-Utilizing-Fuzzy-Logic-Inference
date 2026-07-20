const fs = require('fs');
const files = ['Dashboard.tsx', 'Schedule.tsx', 'Inventory.tsx', 'Notifications.tsx', 'Analytics.tsx', 'Devices.tsx', 'Profile.tsx'];
for (const file of files) {
  const path = 'web/src/' + file;
  if (!fs.existsSync(path)) continue;
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('<aside className="sidebar">')) {
    content = content.replace(/<aside className="sidebar">[\s\S]*?<\/aside>/, '<Sidebar />');
    if (!content.includes('import Sidebar')) {
      content = 'import Sidebar from "./Sidebar";\n' + content;
    }
    fs.writeFileSync(path, content);
    console.log('Updated ' + file);
  }
}
