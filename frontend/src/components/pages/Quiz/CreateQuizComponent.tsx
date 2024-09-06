import './theme.css'
import Image from "next/image";
import styles from './styles.module.scss'
import {Inter} from "next/font/google";

const inter = Inter({subsets: ['latin']})

const CreateQuizItem = () => {
    return (
        <div className={styles.quiz__background}>
            <div className={`${styles.quiz__item} ${inter.className}`}>
                <div className={styles.qiuz__icon}>
                    <div className={styles.quiz__title} style={{
                        fontSize: '2.4vh',
                        fontWeight: 'bold',
                        opacity: '0.6',
                        color: '#FFFFFF'
                    }}>Quiz</div>
                    <Image className={styles.quiz__image} src={'/images/quiz/fox.svg'} alt={''} width={104} height={103}></Image>
                    <Image className={styles.quiz__image} src={'/images/quiz/help.svg'} alt={''} width={12} height={24}></Image>
                </div>
                <div className={styles.quiz__description}>Совершите покупку в нашем интернет-магазине</div>
                <div className={styles.quiz__award}>+ 1000 points</div>
                <div className={styles.quiz__background_begin}>
                    <div className={styles.quiz__begin}>
                        <text className={styles.quiz__begin_text}>Начать</text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function CreateQuizComponent() {

    return (
        <div className={styles.quiz}>
            <CreateQuizItem />
            <CreateQuizItem />
            <CreateQuizItem />
        </div>
    )
}

export default CreateQuizComponent;