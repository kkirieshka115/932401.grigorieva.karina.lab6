const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const movies = [
    {
        id: 1,
        title: "Зеленая миля",
        year: 1999,
        rating: 9.1,
        genre: "Драма",
        director: "Фрэнк Дарабонт",
        duration: "189 мин",
        poster: "/posters/1.jpg",
        desc: "Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зеленую милю» по пути к месту казни. Но однажды сюда привозят Джона Коффи, обладающего невероятным даром."
    },
    {
        id: 2,
        title: "Начало",
        year: 2010,
        rating: 8.8,
        genre: "Триллер",
        director: "Кристофер Нолан",
        duration: "148 мин",
        poster: "/posters/2.jpg",
        desc: "Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим."
    },
    {
        id: 3,
        title: "Интерстеллар",
        year: 2014,
        rating: 8.7,
        genre: "Фантастика",
        director: "Кристофер Нолан",
        duration: "169 мин",
        poster: "/posters/3.jpg",
        desc: "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей отправляется сквозь червоточину в путешествие в поисках новой планеты."
    },
    {
        id: 4,
        title: "Дюна: Часть вторая",
        year: 2024,
        rating: 8.5,
        genre: "Фантастика",
        director: "Дени Вильнёв",
        duration: "166 мин",
        poster: "/posters/4.jpg",
        desc: "Герцог Пол Атрейдес присоединяется к фременам, чтобы стать Муад'Дибом, одновременно пытаясь остановить наступление войны."
    },
    {
        id: 5,
        title: "Оппенгеймер",
        year: 2023,
        rating: 8.3,
        genre: "Биография",
        director: "Кристофер Нолан",
        duration: "180 мин",
        poster: "/posters/5.jpg",
        desc: "История жизни американского физика-теоретика Роберта Оппенгеймера, который во время Второй мировой войны руководил Манхэттенским проектом."
    },
    {
        id: 6,
        title: "Бегущий по лезвию 2049",
        year: 2017,
        rating: 7.8,
        genre: "Киберпанк",
        director: "Дени Вильнёв",
        duration: "164 мин",
        poster: "/posters/6.jpg",
        desc: "В недалеком будущем мир населен людьми и репликантами. Офицер полиции Кей случайно становится обладателем секретной информации, которая ставит под угрозу существование всего человечества."
    },
    {
        id: 7,
        title: "Веном",
        year: 2018,
        rating: 6.7,
        genre: "Боевик",
        director: "Рубен Фляйшер",
        duration: "112 мин",
        poster: "/posters/7.jpg",
        desc: "Что, если в один прекрасный день в тебя вселится существо-симбиот, которое наделит тебя сверхчеловеческими способностями?"
    },
    {
        id: 8,
        title: "Сумерки",
        year: 2008,
        rating: 5.3,
        genre: "Фэнтези",
        director: "Кэтрин Хардвик",
        duration: "122 мин",
        poster: "/posters/8.jpg",
        desc: "Семнадцатилетняя девушка Белла переезжает к отцу в небольшой дождливый городок Форкс и влюбляется в загадочного одноклассника."
    },
    {
        id: 9,
        title: "Бойцовский клуб",
        year: 1999,
        rating: 8.7,
        genre: "Триллер",
        director: "Дэвид Финчер",
        duration: "139 мин",
        poster: "/posters/9.jpg",
        desc: "Страдающий от хронической бессонницы офисный работник встречает харизматичного торговца мылом Тайлера Дёрдена. Вместе они создают подпольный клуб, который быстро перерастает в нечто гораздо большее."
    },
    {
        id: 10,
        title: "Обсессия",
        year: 2025,
        rating: 7.4,
        genre: "Ужасы • Триллер",
        director: "Карри Баркер",
        duration: "102 мин",
        poster: "/posters/10.jpg",
        desc: "Загадочный артефакт исполнения желаний попадает в руки влюблённого музыканта, но за исполнение заветной мечты приходится платить пугающую и непредсказуемую цену."
    }
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        serverTime: new Date().toLocaleTimeString('ru-RU'),
        variant: 15
    });
});

app.get('/api/movies', (req, res) => {
    let result = [...movies];

    if (req.query.minRating !== undefined && req.query.minRating !== '') {
        const minRating = Number(req.query.minRating);

        if (isNaN(minRating) || minRating < 0 || minRating > 10) {
            return res.status(400).json({
                error: 'Некорректный параметр minRating. Введите число от 0 до 10.'
            });
        }

        result = result.filter(movie => movie.rating >= minRating);
    }

    result.sort((a, b) => b.rating - a.rating);
    res.json(result);
});

app.get('/api/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === Number(req.params.id));
    if (!movie) {
        return res.status(404).json({ error: 'Фильм не найден' });
    }
    res.json(movie);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});