import Quiz from '../../../../classes/games/Quiz.js';
import options from './options.quiz.js';
import play from './play.quiz.js';
import newQuizCategory from './newQuizCategory.quiz.js';
import reviewCategory from './reviewCategory.quiz.js';
import acceptCategory from './acceptCategory.quiz.js';
import denyCategory from './denyCategory.quiz.js';
import newQuestion from './newQuestion.quiz.js';
import newQuizQuestion from './newQuizQuestion.quiz.js';
import reviewQuestion from './reviewQuestion.quiz.js';
import acceptQuestion from './acceptQuestion.quiz.js';
import newQuizRefuse from './newQuizRefuse.quiz.js';
import editQuestion from './editQuestion.quiz.js';
import newQuizEdition from './newQuizEdition.quiz.js';
import questionInfo from './questionInfo.quiz.js';
import newQuizEditionAdmin from './newQuizEditionAdmin.quiz.js';
import deleteQuestionRequest from './deleteQuestionRequest.quiz.js';
import deleteQuestion from './deleteQuestion.quiz.js';
import newQuizReport from './newQuizReport.quiz.js';
import reviewReports from './reviewReports.quiz.js';
import feedbackReport from './feedbackReport.quiz.js';
import editPainel from './editPainel.quiz.js';
import editCategory from './editCategory.quiz.js';
import newEditCategory from './newEditCategory.quiz.js';
import newQuizCuriosity from './newQuizCuriosity.quiz.js';
import saveQuestion from './saveQuestion.quiz.js';
import { Emojis as e } from '../../../../util/util.js';
import { SaphireClient as client } from '../../../../classes/index.js';
import { ButtonStyle } from 'discord.js';

export default async (interaction, { src }) => {

    if (!src)
        return await interaction.reply({ content: `${e.Deny} | \`src\` indefinido. #156484165`, ephemeral: true })

    const execute = {
        options, play, back, editPainel,
        newQuizCategory, reviewCategory,
        acceptCategory, denyCategory,
        newQuestion, newQuizQuestion,
        reviewQuestion, acceptQuestion, saveQuestion,
        newQuizRefuse, editQuestion, newQuizCuriosity,
        newQuizEdition, questionInfo, editCategory,
        newQuizEditionAdmin, deleteQuestionRequest,
        deleteQuestion, report: Quiz.newReport,
        newCategory: Quiz.newCategory,
        refuseModel: Quiz.defineRefuseReason,
        newQuizReport, reviewReports,
        modalFeedback: Quiz.showModalFeedback,
        addCuriosity: Quiz.addCuriosity
    }[src]

    if (!execute) {

        if (src.includes('editCategory'))
            return newEditCategory(interaction)

        if (Quiz.categories.includes(src))
            return Quiz.newQuestion(interaction, src)

        if (interaction.customId.includes('newQuizfeedback'))
            return feedbackReport(interaction)

        return await interaction.update({
            content: `${e.DenyX} | Nenhuma função foi encontrada para esta interação. #13256987`,
            embeds: [], components: []
        }).catch(() => { })
    }

    return await execute(interaction)

    async function back() {

        if (interaction.user.id !== interaction.message?.interaction?.user?.id)
            return await interaction.reply({
                content: `${e.DenyX} | Epa epa, só <@${interaction.message?.interaction?.user?.id}> pode usar essa função, beleza?`,
                ephemeral: true
            })

        return await interaction.update({
            embeds: [{
                color: client.blue,
                title: `${e.QuizLogo} ${client.user.username}'s Quiz`,
                footer: {
                    text: `❤️ Powered By: ${client.user.username}'s Community`
                }
            }
            ],
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Jogar",
                        custom_id: JSON.stringify({ c: 'quiz', src: 'play' }),
                        style: ButtonStyle.Success
                    },
                    {
                        type: 2,
                        label: "Mais Opções",
                        custom_id: JSON.stringify({ c: 'quiz', src: 'options' }),
                        style: ButtonStyle.Primary
                    }
                ]
            }]
        })
    }

}