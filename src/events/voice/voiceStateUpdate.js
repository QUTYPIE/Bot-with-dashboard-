const { trackVoiceStats } = require("@handlers/stats");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').VoiceState} oldState
 * @param {import('discord.js').VoiceState} newState
 */
module.exports = async (client, oldState, newState) => {
  // Track voice stats
  trackVoiceStats(oldState, newState);

  // Erela.js
  if (client.config.MUSIC.ENABLED) {
    const guild = oldState.guild;

    // if nobody left the channel in question, return.
    if (oldState.channelId !== guild.members.me.voice.channelId || newState.channel) return;

    // otherwise, check how many people are in the channel now
    if (oldState.channel.members.size === 1) {
      setTimeout(() => {
        // if 1 (you), wait 1 minute
        if (!oldState.channel.members.size - 1) {
          const player = client.musicManager.getPlayer(guild.id);
          if (player) player.destroy(); // destroy the player
        }
      }, client.config.MUSIC.IDLE_TIME * 1000);
    }
  }
};
