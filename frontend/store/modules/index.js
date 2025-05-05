
const modules = {}

const files = import.meta.glob('./*.js', { eager: true })

for (const path in files) {
    const name = path
    .replace('./', '')
    .replace('.store.js', '')    
  modules[name] = files[path].default
}

export default modules