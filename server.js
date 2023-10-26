const express = require('express');
const { sequelize } = require('./config/config');
const cors = require('cors');

// const authRoutes = require('./routes/ authRoutes');
const examRoutes = require('./routes/examRoutes'); 
const subjectRoutes = require('./routes/subjectRoutes'); 
const topicRoutes = require('./routes/topicRoutes');
const questionRoutes = require('./routes/questionRoutes'); 
const studentsRoutes = require('./routes/studentRoutes');
const blogRoutes = require('./routes/blogRoutes');
const slideRoutes = require('./routes/slideRoutes');
const packageRoutes = require('./routes/packageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cartRoutes = require('./routes/cartRoutes');
const featureRoutes = require('./routes/featureRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userAnswersRoutes = require('./routes/userAnswersRoutes');



const responseHandler = require('./utils/responseHandler'); 
const authenticateToken = require('./middleware/authMiddleware');

const app = express();
app.use(
  cors({ 
    origin: ['http://10.1.10.75:3000', 'http://localhost:3000','http://10.1.10.90:3000', 'http://localhost:3000','http://10.1.10.90:3001', 'http://localhost:3001'],
    // origin:"*",
    methods: 'GET,POST,DELETE,PUT',
    allowedHeaders: 'Content-Type,Authorization',
  })
);  
app.get('/',(req,res)=>{
  res.send('hello from root path')
})

app.use('/uploads', express.static('./uploads'));
app.use('/pdfs', express.static('pdf'));

app.use(express.json());
// app.use('/auth', authRoutes);
app.use('/exams', examRoutes); 
app.use('/subjects', subjectRoutes); 
app.use('/topics', topicRoutes); 
app.use('/questions', questionRoutes); 
app.use('/students', studentsRoutes);
app.use('/blog', blogRoutes);
app.use('/slide', slideRoutes);
app.use('/package',packageRoutes);
app.use('/group',groupRoutes);
app.use('/testimonial',testimonialRoutes);
app.use('/dashboard',dashboardRoutes);
app.use('/feature',featureRoutes);
app.use('/cart',cartRoutes);
app.use('/payment',paymentRoutes);
app.use('/pdfs', pdfRoutes); 
app.use('/admin',adminRoutes);
app.use('/useranswer',userAnswersRoutes);


app.get('/profile', authenticateToken, (req, res) => {
responseHandler.success(res, 'You are logged in', { userId: req.user.id });
});

sequelize.sync().then(() => {
  app.listen(3501, () => {
    console.log('Server is running on port 3501');
  });
});