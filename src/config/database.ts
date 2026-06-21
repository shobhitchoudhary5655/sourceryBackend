import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'mysql',
        logging: false,
        timezone: '+05:30',

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            // useUTC: false,
        },
    }
);

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connected Successfully');
    } catch (error) {
        console.error('❌ Database Connection Error');
        console.error(error);
        process.exit(1);
    }
};

export default sequelize;