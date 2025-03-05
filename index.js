import app from './app/app.js';
const PORT = process.env.PORT || 3999;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
