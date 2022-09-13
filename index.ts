import { Client, GatewayIntentBits, Routes, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { REST } from 'discord.js'
import postSchema from './post-schema'


dotenv.config();

const guildId = '402652836606771202';
const appId = process.env.APP_ID || ''
const token = process.env.TOKEN || ''
const james = '206232637424140289';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

const rest = new REST({ version: '10' }).setToken(token)

client.on('ready', async () => {
    await mongoose.connect(
        process.env.MONGO_URI || '', {
            keepAlive: true
        })

    console.log('the bot is ready')
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.user.id === james)

            if (interaction.commandName === 'post') {
                const title = interaction.options.getString('title')
                const body = interaction.options.getString('content')
                const cat = interaction.options.getString('category')
                let attachment = interaction.options.getAttachment('attachment')

                await new postSchema({
                    title: title,
                    category: cat || '',
                    body: body,
                    image: attachment?.url || ''
                }).save()
                const embedder  = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Post Submitted")
                    .setThumbnail('https://jamescape-web-qolors.vercel.app/jamescape.png')
                    .addFields(
                        { name: 'James Rant', value: body || ''},
                    )
                await interaction.reply({ embeds: [embedder] })
            }
    }
})

async function main() {
    const postCommand = new SlashCommandBuilder()
        .setName('post')
        .setDescription('Start a New Post to JameScape')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of Post')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('category')
                .setDescription('Topic of the Post')
                .addChoices(
                    { name: 'Leveling', value: 'leveling' },
                    { name: 'Combat', value: 'combat' },
                    { name: 'Misc', value: 'misc' },
                )
                .setRequired(true))
        .addStringOption(option => 
            option.setName('content')
                .setDescription('Main Content of the Post')
                .setRequired(true))
        .addAttachmentOption(option => 
            option.setName('attachment')
                .setDescription('Insert Image with Upload')
                )

    const commands = [postCommand]
    try {
        await rest.put(Routes.applicationGuildCommands(appId, guildId), { 
            body: commands, 
        })
        client.login(process.env.TOKEN)
    } catch (err) {
        console.log(err);
    }
}

main();
