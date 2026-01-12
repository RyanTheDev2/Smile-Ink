import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
  TextChannel,
  ComponentType
} from "discord.js";
import { storage } from "./storage";

// Configuration
const REVIEW_CHANNEL_ID = "1456382405329031260";
const HIRING_CHANNEL_ID = "1456382266522734738";
const FOR_HIRE_CHANNEL_ID = "1456382344138068151";
const LOG_CHANNEL_ID = "1456634149422239868";

export async function startBot() {
  if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
    console.log("Skipping Discord bot startup: Missing DISCORD_TOKEN or DISCORD_CLIENT_ID");
    return;
  }

  const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ] 
  });

  // Register Commands
  const commands = [
    new SlashCommandBuilder()
      .setName('post')
      .setDescription('Create a marketplace post (Hiring or For Hire)')
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('Clearing old commands and refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: [] });

    const guildId = process.env.DISCORD_GUILD_ID;
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
        { body: commands },
      );
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands },
      );
    }
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  const drafts = new Map<string, any>();

  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'post') {
          const userPosts = await storage.getPostsByCreator(interaction.user.id);
          const hasPosts = userPosts.length > 0;
          
          const draftId = `${interaction.user.id}_${Date.now()}`;
          const draft = {
            title: "Untitled Post",
            description: "No description provided",
            payment: "Not set",
            paymentType: "Not set",
            type: "hiring",
            reference: "Not set",
            creatorId: interaction.user.id,
            creatorUsername: interaction.user.username,
            creatorAvatar: interaction.user.avatar
          };
          drafts.set(draftId, draft);

          const embed = new EmbedBuilder()
            .setTitle(draft.title)
            .setColor('#F1C40F')
            .setAuthor({ name: 'Marketplace Preview' })
            .addFields(
              { name: 'Description', value: draft.description },
              { name: 'Payment Details', value: `Amount: ${draft.payment}\nType: ${draft.paymentType}`, inline: false },
              { name: 'Contact Information', value: `Creator: ${interaction.user.username}\nID: <@${interaction.user.id}>`, inline: false }
            );

          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`edit_${draftId}`).setLabel(hasPosts ? 'Edit / Repost' : 'Create New Post').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`sub_${draftId}`).setLabel('Submit').setStyle(ButtonStyle.Success)
          );

          if (hasPosts) {
            buttons.addComponents(
              new ButtonBuilder().setCustomId(`new_${draftId}`).setLabel('Create New Post').setStyle(ButtonStyle.Secondary)
            );
          }

          const typeSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`st_${draftId}`)
              .setPlaceholder('Select Hiring Type')
              .addOptions(
                { label: 'Hiring', value: 'hiring' },
                { label: 'For Hire', value: 'for_hire' }
              )
          );

          const paymentTypeSelect = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`spt_${draftId}`)
              .setPlaceholder('Select Payment Type')
              .addOptions(
                { label: 'USD', value: 'USD' },
                { label: 'Robux', value: 'Robux' }
              )
          );

          // Send components in correct order: embed first, then selects, then action buttons
          await interaction.reply({ 
            embeds: [embed], 
            components: [typeSelect, paymentTypeSelect, buttons], 
            ephemeral: true 
          });
        }
      } else if (interaction.isStringSelectMenu()) {
        const parts = interaction.customId.split('_');
        const draftId = parts.slice(1).join('_');
        const draft = drafts.get(draftId);
        if (!draft) return;

        if (interaction.customId.startsWith('st_')) {
          draft.type = interaction.values[0];
        } else if (interaction.customId.startsWith('spt_')) {
          draft.paymentType = interaction.values[0];
        }

        const embed = new EmbedBuilder()
          .setTitle(draft.title)
          .setColor('#F1C40F')
          .setAuthor({ name: 'Marketplace Preview' })
          .addFields(
            { name: 'Description', value: draft.description },
            { name: 'Payment Details', value: `Amount: ${draft.payment}\nType: ${draft.paymentType}`, inline: false },
            { name: 'Contact Information', value: `Creator: ${interaction.user.username}\nID: <@${interaction.user.id}>`, inline: false }
          );

        if (draft.type === 'for_hire') {
          embed.addFields({ name: 'Portfolio / Past Work', value: draft.pastWork || 'Not set' });
        } else if (draft.type === 'hiring') {
          embed.addFields({ name: 'Reference', value: draft.reference || 'Not set' });
        }

        await interaction.update({ embeds: [embed] });
      } else if (interaction.isButton()) {
        const parts = interaction.customId.split('_');
        const action = parts[0];
        const id = parts.slice(1).join('_');

        if (action === 'edit') {
          const draft = drafts.get(id);
          if (!draft) return;

          const modal = new ModalBuilder().setCustomId(`em_${id}`).setTitle('Edit Post');
          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Title').setStyle(TextInputStyle.Short).setValue(draft.title)),
            new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('description').setLabel('Description').setStyle(TextInputStyle.Paragraph).setValue(draft.description)),
            new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('payment').setLabel('Payment').setStyle(TextInputStyle.Short).setValue(draft.payment))
          );

          if (draft.type === 'for_hire') {
            modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('past_work').setLabel('Past Work').setStyle(TextInputStyle.Paragraph).setValue(draft.pastWork || '')));
          } else if (draft.type === 'hiring') {
            modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('reference').setLabel('Reference (Optional)').setStyle(TextInputStyle.Paragraph).setValue(draft.reference || '').setRequired(false)));
          }

          await interaction.showModal(modal);
        } else if (action === 'sub') {
          const draft = drafts.get(id);
          if (!draft || draft.payment === 'Not set' || draft.paymentType === 'Not set') {
            return interaction.reply({ content: 'Please fill in all fields before submitting.', ephemeral: true });
          }

          const post = await storage.createPost({ ...draft, status: 'pending' });
          drafts.delete(id);

          const embed = new EmbedBuilder()
            .setTitle('Awaiting Approval')
            .setDescription('A new marketplace listing has been submitted and requires review.')
            .setColor('#F39C12')
            .addFields(
              { name: 'Listing Details', value: `**Title:** ${post.title}\n**Category:** ${post.type === 'hiring' ? 'Hiring' : 'For Hire'}\n**Payment:** ${post.payment} ${post.paymentType}`, inline: false },
              { name: 'Description', value: post.description || 'No description provided', inline: false },
              { name: 'Submission Info', value: `**User:** ${post.creatorUsername}\n**Discord ID:** <@${post.creatorId}>`, inline: false }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp();

          if (post.pastWork) embed.addFields({ name: 'Portfolio / Past Work', value: post.pastWork, inline: false });

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`approve_${post.id}`).setLabel('Approve').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`denytrig_${post.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
          );

          const channel = await client.channels.fetch(REVIEW_CHANNEL_ID) as TextChannel;
          await channel.send({ embeds: [embed], components: [row] });
          await interaction.update({ content: 'Post successfully submitted for review', embeds: [], components: [] });
        } else if (action === 'approve') {
          const postId = parseInt(id);
          const post = await storage.updatePostStatus(postId, 'approved');
          if (post) {
            const targetChannelId = post.type === 'hiring' ? HIRING_CHANNEL_ID : FOR_HIRE_CHANNEL_ID;
            const channel = await client.channels.fetch(targetChannelId) as TextChannel;
            const logChannel = await client.channels.fetch(LOG_CHANNEL_ID) as TextChannel;

            const reviews = await storage.getReviewsByPost(post.id);
            const avgRating = reviews.length ? reviews.reduce((a: number, b: any) => a + (b.rating as number), 0) / reviews.length : 0;

            const postEmbed = new EmbedBuilder()
              .setTitle(post.title)
              .setDescription(post.description)
              .setColor('#F1C40F')
              .addFields(
                { name: 'Payment', value: `${post.payment} ${post.paymentType}`, inline: true },
                { name: 'Contact', value: `<@${post.creatorId}>`, inline: true }
              )
              .setFooter({ 
                text: `Rating: ${avgRating.toFixed(1)}/5 (${reviews.length} reviews)`,
                iconURL: interaction.user.displayAvatarURL()
              });

            if (post.type === 'for_hire' && post.pastWork) {
              postEmbed.setImage(post.pastWork);
            } else if (post.type === 'hiring' && post.reference) {
              postEmbed.setImage(post.reference);
            }

            await channel.send({ embeds: [postEmbed] });
            
            // Log it
            const logEmbed = new EmbedBuilder()
              .setTitle('Post Approved')
              .setColor('#2ECC71')
              .addFields(
                { name: 'Title', value: post.title },
                { name: 'User', value: `<@${post.creatorId}>` },
                { name: 'Moderator', value: `<@${interaction.user.id}>` }
              )
              .setTimestamp();
            await logChannel.send({ embeds: [logEmbed] });

            // DM User
            const user = await client.users.fetch(post.creatorId);
            await user.send(`✅ Your marketplace post "${post.title}" has been approved!`).catch(() => {});

            // Delete from review channel
            await interaction.message.delete().catch(() => {});
          }
        } else if (action === 'denytrig') {
          const postId = parseInt(id);
          const modal = new ModalBuilder().setCustomId(`dm_${postId}`).setTitle('Rejection Reason');
          modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Reason').setStyle(TextInputStyle.Paragraph).setRequired(true)));
          return await interaction.showModal(modal);
        }
      } else if (interaction.isModalSubmit()) {
        const parts = interaction.customId.split('_');
        const action = parts[0];
        const id = parts.slice(1).join('_');

        if (action === 'em') {
          const draft = drafts.get(id);
          if (!draft) return;

          draft.title = interaction.fields.getTextInputValue('title');
          draft.description = interaction.fields.getTextInputValue('description');
          // Numeric only for payment
          draft.payment = interaction.fields.getTextInputValue('payment').replace(/\D/g, '');
          if (draft.type === 'for_hire') draft.pastWork = interaction.fields.getTextInputValue('past_work');
          if (draft.type === 'hiring') draft.reference = interaction.fields.getTextInputValue('reference');

          const embed = new EmbedBuilder()
            .setTitle(draft.title)
            .setColor('#F1C40F')
            .setAuthor({ name: 'Marketplace Preview' })
            .addFields(
              { name: 'Description', value: draft.description },
              { name: 'Payment Details', value: `Amount: ${draft.payment}\nType: ${draft.paymentType}`, inline: false },
              { name: 'Contact Information', value: `Creator: ${interaction.user.username}\nID: <@${interaction.user.id}>`, inline: false }
            );
          if (draft.type === 'for_hire') embed.addFields({ name: 'Portfolio / Past Work', value: draft.pastWork || 'Not set' });
          if (draft.type === 'hiring') embed.addFields({ name: 'Reference', value: draft.reference || 'Not set' });

          const message = interaction.message;
          if (message) {
            await message.edit({ embeds: [embed] }).catch(console.error);
          }
          await interaction.reply({ content: 'Draft details updated', ephemeral: true });
        } else if (action === 'dm') {
          const postId = parseInt(id);
          const reason = interaction.fields.getTextInputValue('reason');
          await storage.updatePostStatus(postId, 'rejected');

          const post = await storage.getPost(postId);
          if (post) {
            const user = await client.users.fetch(post.creatorId);
            await user.send(`Your marketplace post "${post.title}" was rejected for the following reason: ${reason}`).catch(() => {});

            const logChannel = await client.channels.fetch(LOG_CHANNEL_ID) as TextChannel;
            const logEmbed = new EmbedBuilder()
              .setTitle('Post Rejected')
              .setColor('#E74C3C')
              .addFields(
                { name: 'Title', value: post.title },
                { name: 'User', value: `<@${post.creatorId}>` },
                { name: 'Moderator', value: `<@${interaction.user.id}>` },
                { name: 'Reason', value: reason }
              )
              .setTimestamp();
            await logChannel.send({ embeds: [logEmbed] });

            // Delete from review channel
            await interaction.message?.delete().catch(() => {});
          }

          if (interaction.message) {
            try {
              await interaction.deferUpdate();
            } catch (e) {
              await interaction.reply({ content: `Rejected by ${interaction.user.username} for: ${reason}`, ephemeral: true });
            }
          } else {
            await interaction.reply({ content: `Post rejected for: ${reason}`, ephemeral: true });
          }
        }
      }
    } catch (e) { console.error(e); }
  });

  await client.login(process.env.DISCORD_TOKEN);
}
