const { SlashCommandBuilder } = require('discord.js')
const { objToList } = require('../utils.js')
const convertContent = require('../contentConverter')
const voiceRead = require('../voiceRead')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('read')
    .addStringOption((option) =>
      option.setName('text').setDescription('喋らせたい内容').setRequired(true),
    )
    .setDescription('引数に渡されたメッセージを読み上げます。')
    .setDMPermission(false),

  async execute(interaction, client) {
    const { options } = interaction
    const text = options.getString('text')
    const ctx = voiceRead.guilds.get(interaction.guild)
    if (!ctx.isJoined()) {
      return interaction.reply({
        embeds: [
          {
            color: 0xff0000,
            title: 'エラー',
            description: 'BOTはこのサーバーのVCに参加していません。',
          },
        ],
        ephemeral: true,
      })
    }
    const convertedMessage = convertContent(text, interaction.guild.id, client)
      .trim()
      .replace('\n', '')
    if (convertedMessage.length === 0) return
    ctx.addMessage(convertedMessage, interaction)
    return interaction.reply('メッセージを読み上げキューに追加しました。')
  },
}
