'use client';

import { useState, useEffect } from "react";
import { BookOpen, Bookmark, NotebookPen, Settings, Flame, ChevronLeft, Check, Lock, ArrowRight, Sparkles, Target, Crown, Coins, Compass, Flame as FireIcon, User, Edit2 } from "lucide-react";
import { createClient } from '../lib/supabase';
import { loadUserData, saveProfile, unlockDay, completeDay, saveStreak, saveNote as saveNoteDB, toggleBookmarkDB } from '../lib/db';


/* ============ CONSTANTS ============ */

const COLORS = {
  navy: "#0F1B2D",
  navyDeep: "#091322",
  charcoal: "#1A2238",
  charcoalLight: "#222C45",
  gold: "#C9A961",
  goldSoft: "#D4B870",
  goldDim: "#8C7440",
  cream: "#F5F1E8",
  muted: "#8B92A8",
  border: "#2A3450",
  borderSoft: "#1F2942",
};

const USER_TYPES = [
  { id: "founder", label: "Founder", desc: "Building something from zero" },
  { id: "executive", label: "Executive", desc: "Leading at scale" },
  { id: "creative", label: "Creative", desc: "Building through craft and storytelling" },
  { id: "entrepreneur", label: "Entrepreneur", desc: "Multiple ventures, always building" },
];

const READING_PATHS = [
  {
    id: "chronological",
    name: "Chronological",
    tagline: "The Bible in the order events actually happened.",
    description: "The Bible was not written in chronological order. This path rebuilds the timeline so you experience the story as it unfolded -- creation, the patriarchs, the kings, the exile, Christ, the early church. Best if context, history, and story flow matter to you.",
    daysApprox: 365,
  },
  {
    id: "book_by_book",
    name: "Book by Book",
    tagline: "Each book of the Bible, start to finish, with depth.",
    description: "Move through one book at a time -- understanding its author, audience, and message before moving to the next. Slower, more thorough. Best if you want to genuinely know each book rather than skim across many.",
    daysApprox: 1189,
  },
  {
    id: "thematic",
    name: "Thematic Tracks",
    tagline: "Scripture organized around what you actually face daily.",
    description: "Five tracks built for the entrepreneur mind: Vision, Leadership, Money, Faith Under Pressure, and Wisdom. Pulls passages from across the whole Bible. Best if you want immediate, applicable depth on the topics that matter most to how you build.",
    daysApprox: 600,
  },
  {
    id: "old_new",
    name: "Old + New Together",
    tagline: "An Old Testament passage and a New Testament passage, paired.",
    description: "Read a passage from the Old Testament and one from the New each day -- chosen to connect or contrast. Best if you want a balanced view and to see how the whole Bible tells one continuous story.",
    daysApprox: 730,
  },
];

const PACES = [
  {
    id: "five_per_week",
    name: "5 days a week",
    desc: "Steady rhythm. Weekends free for rest and reflection.",
    multiplier: 1.4,
  },
  {
    id: "one_per_day",
    name: "One a day",
    desc: "Every single day. Maximum consistency, fastest completion.",
    multiplier: 1.0,
  },
  {
    id: "two_per_week",
    name: "Two longer sessions",
    desc: "Two deeper sessions weekly. Built for very busy weeks.",
    multiplier: 3.5,
  },
];

const THEMATIC_TRACKS = [
  { id: "vision", name: "Vision & Purpose", desc: "Why you were built to build." },
  { id: "leadership", name: "Leadership & Authority", desc: "Leading people well." },
  { id: "money", name: "Money & Stewardship", desc: "What scripture really says about wealth." },
  { id: "pressure", name: "Faith Under Pressure", desc: "Trusting God when things break." },
  { id: "wisdom", name: "Wisdom & Decision Making", desc: "Discernment, counsel, timing." },
];

/* ============ ENTRIES ============ */

const ENTRIES = {
  chronological: [
    {
      id: "chrono-1",
      day: 1,
      reading: "Genesis 1 (NIV)",
      hook: "Before anything existed, only God did. Watch how He builds.",
      contextPreview: "Genesis was traditionally attributed to Moses around 1400 BC, written for a people who had just walked out of Egyptian slavery and needed to know who their God was...",
      context: "Genesis was traditionally attributed to Moses around 1400 BC, written for a people who had just walked out of Egyptian slavery and needed to know who their God was, where they came from, and why they mattered. Chapter 1 opens with the most foundational claim in scripture: God spoke, and reality came into being. Every other religion of the time had gods who fought, manipulated, or were limited by matter. Israel's God simply spoke.",
      principlePreview: "God brings order out of chaos through intentional, deliberate creation...",
      principle: "God brings order out of chaos through intentional, deliberate creation. Each step builds on the last. Light before plants. Land before animals. The order matters. The Hebrew word bara (created) is reserved for God alone -- humans make from material; only He creates from nothing.",
      deepDive: "Notice the rhythm: God speaks, it happens, He sees it is good. Six times He pauses to evaluate His own work before continuing. He does not rush. He does not skip steps. And after creating humanity, He blesses them and gives them authority over what He has made. The pattern is speak, act, evaluate, bless, repeat.",
      application: "Building a company from nothing is a faint echo of what God did with the universe. Three takeaways for how you build: One, speak before you build. Vision precedes action. Two, pause to evaluate. Do not just produce; assess. Three, bless what you build. Take genuine pride in good work without slipping into arrogance. Founders who skip evaluation burn out fast. Founders who never feel proud of their work also burn out -- just slower.",
      question: "What are you building right now without first speaking a clear vision over it? And when was the last time you paused to evaluate -- not just outputs, but whether what you are building is actually good?",
      prayer: "Father, You spoke and the universe answered. Help me speak vision over my work today, build with intention, and pause long enough to see whether what I am making is truly good. Amen.",
    },
    {
      id: "chrono-2",
      day: 2,
      reading: "Genesis 2 (NIV)",
      hook: "God plants a garden, then asks a man to name everything in it.",
      contextPreview: "Chapter 2 zooms in. The wide-angle creation account in chapter 1 narrows to focus on one man, one place...",
      context: "Chapter 2 zooms in. The wide-angle creation account in chapter 1 narrows to focus on one man, one place, one assignment. God forms Adam from the dust, breathes life into him, and gives him a job: work the garden, take care of it, and name the animals. This is humanity's first task -- and it is creative, responsible, and meaningful. Work existed before sin did.",
      principlePreview: "Work is not a curse -- it is one of the first gifts God gave...",
      principle: "Work is not a curse -- it is one of the first gifts God gave. Adam was placed in paradise and immediately given responsibility. The garden needed tending, the animals needed naming. God did not make humanity to lounge; He made us to build, cultivate, and lead.",
      deepDive: "Notice that God did not name the animals Himself. He brought them to Adam to see what he would call them. That is delegation at the highest level. The Creator of the universe steps back and gives the human creative authority over what He just made. Adam's first day on the job involved language, observation, and judgment. Then God notices something is not good -- Adam is alone -- and creates Eve. Even in paradise, working alone was not the design.",
      application: "Two principles for builders. First, your work is sacred -- not because of what you produce, but because the act of creating well reflects the One who made you. Stop separating spiritual life from work life. Second, you are not meant to build alone. Adam in paradise still needed a partner. If you are doing everything yourself, you are not being noble; you are being disobedient to design. Find your Eve -- a partner, a team, a co-builder.",
      question: "Are you treating your work as sacred or just as a transaction? And where in your business are you trying to do alone what was designed to be done with others?",
      prayer: "God, You worked before You rested, and You called Your work good. Help me see my own work as something more than output. Show me where I am isolated and need partnership. Amen.",
    },
    {
      id: "chrono-3",
      day: 3,
      reading: "Genesis 3 (NIV)",
      hook: "Everything was perfect. Then someone asked, did God really say...",
      contextPreview: "Chapter 3 explains how everything broke. The serpent does not start by attacking God's existence; he attacks God's words...",
      context: "Chapter 3 explains how everything broke. The serpent does not start by attacking God's existence; he attacks God's words. Did God really say you cannot eat from any tree? That is not what God said -- God only restricted one tree. But the seed of doubt was planted. Eve adds to the command, then breaks it. Adam, standing right there the entire time, says nothing. They eat. Everything changes.",
      principlePreview: "The first attack on humanity was not violence -- it was distortion of God's word...",
      principle: "The first attack on humanity was not violence -- it was a distortion of God's word. Notice the strategy: question what God said, exaggerate the restriction, then promise that disobedience leads to enlightenment. Sin almost always starts with a slight twist of the truth, not a complete lie.",
      deepDive: "Adam's silence is one of the most damning leadership failures in scripture. He was there. He heard the conversation. He chose passivity over protection. When God comes looking for them, Adam blames Eve and indirectly blames God -- the woman You gave me. Eve blames the serpent. No one takes ownership. The consequences are immediate: shame, broken relationships, hard labor, separation from God. But notice the grace -- God still clothes them before sending them out.",
      application: "Three brutal lessons for leaders. One, watch how you handle truth. Slight distortions are how integrity collapses, not dramatic lies. Two, silence is a decision. When something is wrong in your business, your team, your partnerships -- and you say nothing -- you are participating. Three, blame breaks teams faster than failure does. The willingness to say I own this, even when others contributed, is rare and powerful.",
      question: "Where in your work have you stayed silent when you knew you should have spoken? And what is the small distortion of truth -- told to yourself or others -- that is slowly costing you?",
      prayer: "Lord, give me courage to speak when silence is easier. Show me where I have shaded the truth and call me back to honesty. Even when I have failed, You still clothe me. Thank You. Amen.",
    },
  ],
  book_by_book: [
    {
      id: "book-1",
      day: 1,
      reading: "Proverbs 1 (NIV)",
      hook: "Solomon opens the book with a warning -- and an invitation to a different kind of life.",
      contextPreview: "Proverbs is mostly written by Solomon, who became king around 970 BC and was famously the wisest man who ever lived...",
      context: "Proverbs is mostly written by Solomon, who became king around 970 BC and was famously the wisest man who ever lived. He wrote this book partly as a father teaching his son how to navigate the world. Chapter 1 is the introduction -- it lays out why wisdom matters, who it is for, and what happens to those who reject it.",
      principlePreview: "The fear of the Lord is the beginning of knowledge -- meaning real wisdom starts with...",
      principle: "The fear of the Lord is the beginning of knowledge -- meaning real wisdom starts with humility before God, not intelligence or experience. Fools, in this book, are not stupid people. They are people who have rejected correction. That distinction changes everything.",
      deepDive: "Solomon contrasts two voices throughout the chapter: wisdom calling out in the streets, and the seductive pull of crowds that promise quick gain through corruption. Verses 10-19 are a masterclass on how compromise begins -- with a group, a promise of easy reward, and a small step in the wrong direction. The chapter ends with wisdom saying: I called and you refused, so when disaster comes, do not be surprised.",
      application: "For the entrepreneur, this chapter is a survival manual. One, surround yourself carefully -- the people who invite you into shortcuts will not be there when the shortcuts catch up to you. Two, learn to love correction. Most founders surround themselves with yes-people; the wise ones build feedback systems. Three, wisdom is not just smart decisions; it is rooted in reverence. Without God at the center, even good strategy decays into self-serving hustle.",
      question: "Who in your life is allowed to correct you -- not just give input, but actually push back? If no one comes to mind, that is a problem worth fixing this week.",
      prayer: "God, give me a hunger for wisdom that runs deeper than my hunger for success. Surround me with people who tell me the truth. Make my fear of You the foundation of every decision. Amen.",
    },
    {
      id: "book-2",
      day: 2,
      reading: "Proverbs 2 (NIV)",
      hook: "Wisdom is not given to those who casually want it. It is given to those who hunt for it.",
      contextPreview: "Chapter 2 is one long sentence in the original Hebrew -- a single, sustained argument about how wisdom is actually obtained...",
      context: "Chapter 2 is one long sentence in the original Hebrew -- a single, sustained argument about how wisdom is actually obtained. Solomon uses urgent verbs: accept, store up, turn your ear, apply your heart, call out, cry aloud, look for it, search for it. This is not casual study. This is treasure hunting.",
      principlePreview: "Wisdom protects you from two specific dangers: corrupt men and seductive paths...",
      principle: "Wisdom protects you from two specific dangers Solomon names directly: corrupt men whose ways are crooked, and seductive paths that look attractive but lead to death. Wisdom is not just about making good choices -- it is about recognizing the difference between paths that lead to life and paths that lead nowhere.",
      deepDive: "The chapter structure is conditional: if you do these things (verses 1-4), then these results follow (verses 5-22). The if is heavy -- accept, store up, turn your ear, apply your heart, call out, cry aloud. Wisdom is not passive. The result is twofold: you will understand the fear of the Lord, and you will be protected from destructive influences. Notice that wisdom does not just make you smarter -- it changes who you are drawn to and who is drawn to you.",
      application: "Most people consume content about wisdom; few hunt for it. There is a difference between scrolling business advice and actually digging into a difficult passage of scripture or sitting with a hard truth until it changes you. Two practical moves: First, build a regular practice of pursuing wisdom -- not just consuming it. Slow reading, journaling, asking deeper questions. Second, audit who and what is shaping your thinking. Wisdom protects you from corrupt influences, but only if you have done the work to recognize them.",
      question: "Are you actually hunting for wisdom or just casually consuming content about it? What would change if you treated wisdom like buried treasure this month?",
      prayer: "Father, I confess I often want wisdom without working for it. Give me hunger to search, dig, and persist. Protect me from paths that look right but lead away from You. Amen.",
    },
    {
      id: "book-3",
      day: 3,
      reading: "Proverbs 3 (NIV)",
      hook: "Two of the most quoted verses in the Bible sit in this chapter -- and most people miss the surrounding context.",
      contextPreview: "Proverbs 3:5-6 is on coffee mugs everywhere, but in context the chapter is much more demanding...",
      context: "Proverbs 3:5-6 is on coffee mugs everywhere, but in context the chapter is much more demanding than the soft-focus version most people quote. Solomon is laying out a complete framework for the wise life: trust, honor God with your wealth, accept His discipline, value wisdom over riches, treat your neighbor justly, and avoid envying violent people who seem to be winning.",
      principlePreview: "Trusting God is not passive -- it is an active choice to lean away from your own understanding...",
      principle: "Trusting God is not passive -- it is an active choice to lean away from your own understanding even when your understanding seems perfectly logical. Solomon does not say your understanding is wrong; he says it is incomplete. Trusting God means making space for what you cannot yet see.",
      deepDive: "Verses 9-10 are radical for any entrepreneur: honor God with the firstfruits of your wealth, and your barns will be filled. The principle is firstfruits -- not leftovers. In the ancient world, you did not give from what you had after living comfortably; you gave the first portion before knowing how the rest of the year would go. That is trust in financial form. Verses 27-32 then turn outward: do not withhold good from those who deserve it, do not say come back tomorrow when you can help today, do not envy violent people whose ways are crooked.",
      application: "Three brutal applications. One, on decisions: trust does not mean ignoring your judgment; it means submitting your judgment to God's. Pray about big decisions before strategizing them. Two, on money: firstfruits giving is one of the hardest disciplines for entrepreneurs because cash flow is unpredictable. But the principle remains -- give from the top, not the bottom. Three, on people: do not withhold good when it is in your power to act. The number of doors you can open for others is one of the truest measures of your character.",
      question: "Where is your judgment leading the decision and your prayer following? Try reversing the order this week.",
      prayer: "Lord, I confess I lean on my own understanding more than I lean on You. Teach me to trust You first, give You first, and serve others without delay. Amen.",
    },
  ],
  thematic: [
    {
      id: "thematic-vision-1",
      day: 1,
      track: "vision",
      trackName: "Vision & Purpose",
      reading: "Habakkuk 2:1-4 (NIV)",
      hook: "God tells a frustrated prophet to write down the vision -- so plainly that a runner can read it.",
      contextPreview: "Habakkuk was a prophet writing around 600 BC, frustrated that God seemed silent while injustice grew everywhere...",
      context: "Habakkuk was a prophet writing around 600 BC, frustrated that God seemed silent while injustice grew everywhere. Chapter 2 opens with God's response -- and it is one of the most quoted passages in scripture about vision. Write it down. Make it plain. The vision will come at the right time, even if it feels delayed.",
      principlePreview: "A vision that is not written down is a vision that does not exist...",
      principle: "A vision that is not written down is a vision that does not exist. God commands Habakkuk to write the vision plainly -- so plainly that someone running past could read it. Clarity is not optional. Vagueness is the enemy of execution.",
      deepDive: "The Hebrew literally says write the vision and make it plain on tablets, that he who reads it may run. Some translate this as so a herald may run with it. Either way, the principle is the same: a vision must be portable, repeatable, and clear enough to spread without distortion. Then God says something crucial: though it linger, wait for it. It will come. Vision and timing are not the same thing.",
      application: "Three takeaways for vision-driven builders. One, write your vision down -- short enough to fit on one page, clear enough to repeat. If your team cannot articulate it back to you, you have not made it plain. Two, separate vision from timing. Most founders quit good visions because of bad timing. Three, the vision is meant to be shared, not hoarded. If only you can carry it, it will die with you.",
      question: "Can you write your vision in three sentences right now -- without notes? If not, that is your assignment for this week.",
      prayer: "God, give me vision that is clear enough to write, simple enough to share, and big enough to take time. Help me to wait when waiting is required and run when it is time to move. Amen.",
    },
    {
      id: "thematic-leadership-1",
      day: 1,
      track: "leadership",
      trackName: "Leadership & Authority",
      reading: "Exodus 18:13-27 (NIV)",
      hook: "Even Moses needed someone to tell him he was leading wrong.",
      contextPreview: "Moses had just led Israel out of Egypt. He was their judge, lawgiver, and only point of contact with God...",
      context: "Moses had just led Israel out of Egypt. He was their judge, lawgiver, and only point of contact with God. People stood in line from morning until evening waiting for him to settle disputes. His father-in-law Jethro shows up, watches this for one day, and tells Moses bluntly: what you are doing is not good. You will wear yourself out. You cannot do it alone.",
      principlePreview: "The greatest leaders are not the ones who do the most -- they are the ones who develop others to do it well...",
      principle: "The greatest leaders are not the ones who do the most -- they are the ones who develop others to do it well. Moses was not failing because he was incompetent. He was failing because he had not built structure. Doing everything yourself looks like leadership; it is actually a bottleneck.",
      deepDive: "Jethro's advice has three layers. First, teach the people God's ways yourself -- the leader still owns the vision and values. Second, identify capable, trustworthy, God-fearing people. Notice the criteria: capability matters, but character matters more. Third, delegate by tier -- leaders of thousands, hundreds, fifties, tens. Only the hardest cases come to Moses. The genius is not the structure; it is the willingness of Moses to admit he was wrong and change.",
      application: "Two hard truths. One, if you are the bottleneck, you are also the cap on growth. Most founders cannot scale because they refuse to delegate decisions only they can currently make. Build people who can make those decisions. Two, character before competence. You can train skill; you cannot easily train integrity. Hire and promote for both, but never sacrifice the second for the first.",
      question: "What are you currently doing that someone on your team could be developed to do within 90 days? And why have you not started developing them?",
      prayer: "God, expose where my leadership is actually a bottleneck. Give me humility to receive correction the way Moses did. Help me build people, not just systems. Amen.",
    },
    {
      id: "thematic-money-1",
      day: 1,
      track: "money",
      trackName: "Money & Stewardship",
      reading: "1 Timothy 6:6-10, 17-19 (NIV)",
      hook: "Paul writes the most misquoted verse about money in the Bible -- and what he actually said is sharper than people remember.",
      contextPreview: "Paul is writing to his protege Timothy, who is leading the church in Ephesus -- a wealthy commercial city...",
      context: "Paul is writing to his protege Timothy, who is leading the church in Ephesus -- a wealthy commercial city full of merchants, traders, and people pursuing prosperity. False teachers were treating godliness as a means to financial gain. Paul corrects this hard, but he does not say money is evil. He says the love of money is.",
      principlePreview: "The love of money is a root of all kinds of evil -- not money itself, but the heart that loves it...",
      principle: "The love of money is a root of all kinds of evil -- not money itself, but the heart that loves it. Paul does not condemn wealth. He condemns the misplaced affection for it. In the same passage, he tells the rich to be generous and rich in good deeds, not to feel guilty about having resources.",
      deepDive: "Paul's instructions to the wealthy are direct: do not be arrogant, do not put hope in wealth (which is uncertain), put hope in God (who provides everything), be generous, be willing to share. The phrase rich in good deeds is striking -- he is creating a different scoreboard. Wealth measured in dollars matters less than wealth measured in impact, generosity, and faithfulness. Verse 19 says this kind of life takes hold of life that is truly life. Real life is not what money buys; it is what generosity creates.",
      application: "Three principles for builders building wealth. One, money is a tool, not an identity. The moment your sense of self depends on your bank account, you have lost something more valuable than money. Two, generosity is a discipline, not a feeling. Schedule it, plan it, automate it -- do not wait until you feel generous. Three, contentment with godliness is great gain. Discontent is the engine of bad financial decisions. Build a business; do not let it build a hole.",
      question: "If your business doubled tomorrow, would your life look meaningfully different in spending or in giving? Your answer reveals what you actually believe about money.",
      prayer: "Father, You give me everything I have. Loosen my grip on wealth. Make me rich in good deeds, generous in spirit, and content in You. Amen.",
    },
    {
      id: "thematic-pressure-1",
      day: 1,
      track: "pressure",
      trackName: "Faith Under Pressure",
      reading: "Daniel 3:13-30 (NIV)",
      hook: "Three men face a furnace and answer with one of the most powerful sentences in scripture.",
      contextPreview: "Shadrach, Meshach, and Abednego were Jewish exiles serving in Babylon's government around 600 BC...",
      context: "Shadrach, Meshach, and Abednego were Jewish exiles serving in Babylon's government around 600 BC. King Nebuchadnezzar built a massive golden statue and commanded everyone to bow when the music played. They refused. The penalty for refusal was death by fire. They were brought before the most powerful man in the known world to defend themselves.",
      principlePreview: "Their answer is one of the most powerful expressions of faith under pressure in scripture...",
      principle: "Their answer is one of the most powerful expressions of faith under pressure in scripture. They tell the king: our God is able to save us. But even if He does not, we will not bow. They committed to obedience whether or not God rescued them. That is a different category of faith.",
      deepDive: "Notice the structure of their reply. First, an acknowledgment of God's power -- He is able. Second, an acknowledgment of God's freedom -- but even if He does not. Third, an unwavering commitment regardless of outcome -- we still will not serve your gods. Most people pray for outcomes; these three committed to obedience separate from outcomes. When they were thrown in, the fire did not even touch their clothes. A fourth figure walked with them in the flames -- many believe a pre-incarnate Christ. The king who tried to kill them ended up praising their God.",
      application: "Two truths for entrepreneurs in pressure seasons. One, God is able -- but His ability does not guarantee your preferred outcome. Faith says I trust You whether or not You give me what I want. That is the only kind of faith that survives hard seasons. Two, sometimes the rescue is in the fire, not from it. They did not avoid the furnace; they met God in it. Some of your most important spiritual experiences will happen inside difficulties, not before or after them.",
      question: "What outcome are you currently demanding from God in exchange for your faith? Are you willing to obey Him whether or not He gives it to you?",
      prayer: "God, You are able. Whether or not You rescue me from this season, I commit to walking with You. Meet me in the fire if that is where You are. Amen.",
    },
    {
      id: "thematic-wisdom-1",
      day: 1,
      track: "wisdom",
      trackName: "Wisdom & Decision Making",
      reading: "1 Kings 3:5-15 (NIV)",
      hook: "God offers a young king anything he wants. His answer changes the course of history.",
      contextPreview: "Solomon had just become king after his father David. He was young, inexperienced, and leading a nation he felt unequipped to lead...",
      context: "Solomon had just become king after his father David. He was young, inexperienced, and leading a nation he felt unequipped to lead. God appears to him in a dream and says: ask for whatever you want me to give you. Solomon could have asked for wealth, long life, or victory over enemies. He asked for wisdom -- specifically, a discerning heart to govern God's people and tell right from wrong.",
      principlePreview: "Wisdom is not knowing more facts -- it is having a discerning heart...",
      principle: "Wisdom is not knowing more facts -- it is having a discerning heart that can tell the difference between right and wrong, important and urgent, true and merely convincing. Solomon asked for the one resource he knew he could not generate himself.",
      deepDive: "Solomon's prayer reveals deep self-awareness: I am only a little child and do not know how to carry out my duties. Notice he did not ask God to make him look like a great leader; he asked to actually be one. God's response is striking -- because you asked for this and not for long life, wealth, or the death of your enemies, I will give you wisdom and the other things you did not ask for. The lesson: pursuing the right thing first often results in receiving the other things too. Solomon went on to build wealth, peace, and influence on a foundation of wisdom -- but the wisdom came first.",
      application: "Most entrepreneurs pursue success and hope wisdom catches up. Solomon flips the order: pursue wisdom and watch the rest fall in line. Three applications. One, every important decision deserves prayer before strategy. Praying about it forces you to slow down enough to actually think. Two, surround yourself with discerning people and listen when they push back. Wisdom often comes through community, not just solitude. Three, ask better questions. Most bad decisions come from solving the wrong problem well.",
      question: "If God offered you anything tomorrow, what would you actually ask for? Your honest answer reveals what you currently believe matters most.",
      prayer: "God, I am young in many ways, no matter my age. Give me a discerning heart. Help me ask You first, listen to wise people, and choose wisdom over shortcuts. Amen.",
    },
  ],
  old_new: [
    {
      id: "oldnew-1",
      day: 1,
      reading: "Psalm 1 + Matthew 7:24-27 (NIV)",
      hook: "Two passages, one truth: what you build on determines whether you survive the storm.",
      contextPreview: "Psalm 1 opens the book of Psalms with a portrait of two paths. Jesus closes the Sermon on the Mount with a portrait of two builders...",
      context: "Psalm 1 opens the book of Psalms with a portrait of two paths -- the way of the righteous and the way of the wicked. Jesus closes the Sermon on the Mount with a portrait of two builders -- one who builds on rock, one who builds on sand. Both passages, written hundreds of years apart, draw the same line: the foundation determines the outcome.",
      principlePreview: "What you root yourself in determines what you become...",
      principle: "What you root yourself in determines what you become. The Psalmist describes the righteous as a tree planted by streams of water -- yielding fruit, not withering. Jesus says the wise builder is the one who hears His words and puts them into practice. Both pictures point to the same truth: knowledge is not enough. Application is what holds.",
      deepDive: "Psalm 1 contrasts what we delight in. The righteous delight in God's word and meditate on it day and night. The wicked drift through life advised by people who do not know God. Jesus' parable assumes both builders heard His words -- the difference is whether they put those words into practice. Faith that does not change behavior is not faith yet. Both passages also point to a future test. The wicked will not stand in judgment. The house on sand will collapse when the storm comes. Foundations are tested in storms, not sunshine.",
      application: "Two questions for builders. One, what are you rooting yourself in? If your sense of identity, security, and direction comes mostly from your business performance, you have built on sand. Performance is volatile. God's word is not. Two, where is the gap between what you know and what you do? Most Christians do not have an information problem; they have an application problem. This week, do not learn anything new. Apply something you already know.",
      question: "What is one truth from scripture you already know but have not put into practice? Start there this week.",
      prayer: "Lord, root me in Your word. Build me on a foundation that holds when storms come. Show me where I am hearing without doing, and give me courage to apply, not just learn. Amen.",
    },
    {
      id: "oldnew-2",
      day: 2,
      reading: "Proverbs 3:5-12 + James 1:2-8 (NIV)",
      hook: "Old Testament wisdom and New Testament instruction agree: trials grow you when you respond with trust.",
      contextPreview: "Proverbs 3 calls readers to trust God with their whole heart. James, writing centuries later, tells believers to count trials as joy because they produce maturity...",
      context: "Proverbs 3 calls readers to trust God with their whole heart, not lean on their own understanding, and accept God's discipline as evidence of love. James, writing centuries later to early Christians scattered by persecution, tells them to consider trials pure joy because trials produce perseverance, and perseverance produces maturity. Different eras, same conclusion: difficulty is one of God's primary growth tools.",
      principlePreview: "Trials are not interruptions to your growth -- they are often the engine of it...",
      principle: "Trials are not interruptions to your growth -- they are often the engine of it. Proverbs frames it as discipline; James frames it as testing. Both say the same thing: God uses pressure to develop people. Avoiding all difficulty also means avoiding most growth.",
      deepDive: "Proverbs 3:5-6 is the trust framework. Trust with all your heart, do not lean on your own understanding, submit to God in everything, and He will direct your paths. Verses 11-12 add a layer most people skip: do not despise the Lord's discipline, because the Lord disciplines those He loves -- like a father with a son. James 1 takes the same idea and applies it to trials: when (not if) you face trials, count it joy, because the testing of your faith produces perseverance. Then James adds something practical: if you lack wisdom in the trial, ask God, who gives generously and without finding fault.",
      application: "Three principles for trials. One, lean less on your own understanding -- especially in hard seasons. Your understanding in the middle of pain is rarely accurate. Two, do not despise the discipline. The temptation in hard seasons is to interpret difficulty as God's absence; scripture often interprets it as God's presence. Three, ask for wisdom specifically. James says God will give it generously -- but most of us never ask. Pray for wisdom in the specific situation you are in right now.",
      question: "What current difficulty in your business or life are you treating as an obstacle that is actually a teacher? What might it be trying to grow in you?",
      prayer: "Father, when I am in pain, I lean hard on my own understanding. Teach me to lean on You instead. Use the difficulty to grow me, and give me wisdom right now in the situation I am facing. Amen.",
    },
    {
      id: "oldnew-3",
      day: 3,
      reading: "Joshua 1:1-9 + Philippians 4:10-13 (NIV)",
      hook: "Two leaders, two situations, one source of strength.",
      contextPreview: "Joshua had just inherited leadership of Israel after Moses died. Paul was writing from prison facing possible execution...",
      context: "Joshua had just inherited leadership of Israel after Moses died -- enormous expectations, an enormous task, and no one to fall back on. Paul was writing from prison facing possible execution, thanking the Philippians for their support. Two leaders, two completely different situations, one shared truth: strength does not come from circumstances; it comes from a Source.",
      principlePreview: "Real strength is not generated by circumstances -- it is given by God in every condition...",
      principle: "Real strength is not generated by circumstances -- it is given by God in every condition. God tells Joshua three times to be strong and courageous because His presence is the guarantee, not Joshua's ability. Paul says he can do all things through Christ -- meaning he has learned contentment in plenty and in want, because his strength source did not change.",
      deepDive: "Notice the parallel between Joshua 1 and Philippians 4. God tells Joshua: do not be afraid, do not be discouraged, the Lord your God will be with you wherever you go. Paul writes: I have learned the secret of being content in any and every situation. The secret is not stoicism or willpower -- it is the constant presence of God. Joshua had Canaan in front of him. Paul had a prison cell. Both received the same answer: I am with you. Strength is a posture toward God's presence, not a level of personal capability.",
      application: "For builders in any season, two takeaways. One, your strength is not your strength. The moment you start believing your success is fully self-generated, you have set yourself up to fall apart when conditions change. Both Joshua and Paul knew where their strength actually came from. Two, contentment is learned. Paul says it explicitly -- I have learned the secret. It is not automatic. It is not a personality type. It is a discipline cultivated over time, in both abundance and lack.",
      question: "What part of your current strength are you crediting to yourself that should be credited to God? And what season are you in right now -- abundance or lack -- that is teaching you contentment?",
      prayer: "Lord, You are with me wherever I go. My strength comes from You, not from my circumstances or ability. Teach me contentment in this season, whatever it is. Amen.",
    },
  ],
};

/* ============ HELPERS ============ */

const STORAGE_KEY = "entrepreneur-bible-app-v1";

function calcEstimate(pathDays, paceMultiplier) {
  const days = Math.round(pathDays * paceMultiplier);
  const years = (days / 365).toFixed(1);
  return { days, years };
}

function getEntriesForPath(pathId) {
  return ENTRIES[pathId] || [];
}

/* ============ APP ============ */

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState({
    onboarded: false,
    userType: null,
    readingPath: null,
    pace: null,
    completedDays: [],
    unlockedDays: [],
    notes: {},
    bookmarks: [],
    streak: 0,
    lastCompleted: null,
  });
  const [screen, setScreen] = useState("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState(null);

  // Load
  useEffect(() => {
    const supabase = createClient();
  
    const loadData = async (sessionUser) => {
      if (!sessionUser) {
        setUser(null);
        setAuthLoaded(true);
        setLoaded(true);
        return;
      }
      setUser(sessionUser);
      setAuthLoaded(true);
      try {
        const data = await loadUserData(sessionUser.id);
        console.log('loaded data:', data);
        setState(data);
        if (data.onboarded) setScreen('dashboard');
      } catch (e) {
        console.error('Error loading user data:', e);
      }
      setLoaded(true);
    };
  
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadData(session?.user ?? null);
    });
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        return;
      }
      loadData(session?.user ?? null);
    });
  
    return () => subscription.unsubscribe();
  }, []);

  // Save
  const persist = async (next, user) => {
    setState(next);
    if (!user?.id) return;
    try {
      await saveProfile(user.id, user.email, {
        userType: next.userType,
        readingPath: next.readingPath,
        pace: next.pace,
      });
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  if (!authLoaded || !loaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#091322', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A961', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  /* ===== ONBOARDING ===== */
  
  if (screen === "onboarding") {
    return <Onboarding step={onboardingStep} setStep={setOnboardingStep} state={state} persist={(next) => persist(next, user)} setScreen={setScreen} transitioning={transitioning} setTransitioning={setTransitioning} />;
  }

  /* ===== DASHBOARD ===== */
  if (screen === "dashboard") {
    return <Dashboard state={state} persist={persist} setScreen={setScreen} setActiveEntryId={setActiveEntryId} user={user} />;
    }

  /* ===== ENTRY ===== */
  if (screen === "entry" && activeEntryId) {
    return <EntryView entryId={activeEntryId} state={state} persist={persist} setScreen={setScreen} user={user} />;
  }

  /* ===== NOTES ===== */
  if (screen === "notes") {
    return <NotesView state={state} setScreen={setScreen} setActiveEntryId={setActiveEntryId} />;
  }

  /* ===== BOOKMARKS ===== */
  if (screen === "bookmarks") {
    return <BookmarksView state={state} setScreen={setScreen} setActiveEntryId={setActiveEntryId} />;
  }

  /* ===== SETTINGS ===== */
  if (screen === "profile") {
    return <ProfileView state={state} setState={setState} user={user} setScreen={setScreen} />;
  }
  if (screen === "settings") {
    return <SettingsView state={state} persist={persist} setScreen={setScreen} setOnboardingStep={setOnboardingStep} user={user} setUser={setUser} />;
  }

  return null;
}

/* ============ ONBOARDING ============ */

function Onboarding({ step, setStep, state, persist, setScreen, transitioning, setTransitioning }) {
  const [draft, setDraft] = useState({
    userType: state.userType,
    readingPath: state.readingPath,
    pace: state.pace,
  });

  const proceed = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (step < 2) setStep(step + 1);
      else {
        const next = {
          ...state,
          ...draft,
          onboarded: true,
        };
        persist(next);
        setScreen("dashboard");
      }
      setTransitioning(false);
    }, 300);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Top */}
      <div style={{ padding: "24px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 28, height: 3, borderRadius: 2, background: i <= step ? COLORS.gold : COLORS.border, transition: "0.3s" }} />
          ))}
        </div>
        {step > 0 && (
          <button onClick={back} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Back
          </button>
        )}
      </div>

      <div style={{
  padding: "32px 20px 120px",
  maxWidth: 560,
  margin: "0 auto",
  opacity: transitioning ? 0 : 1,
  transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
}}>
  {step === 0 && <Step0 draft={draft} setDraft={setDraft} />}
  {step === 1 && <Step1 draft={draft} setDraft={setDraft} />}
  {step === 2 && <Step2 draft={draft} setDraft={setDraft} />}
</div>

      {/* Continue */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 28px", background: "linear-gradient(to top, " + COLORS.navyDeep + " 80%, transparent)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <button
            onClick={proceed}
            disabled={(step === 0 && !draft.userType) || (step === 1 && !draft.readingPath) || (step === 2 && !draft.pace)}
            style={{
              width: "100%",
              padding: "16px",
              background: ((step === 0 && draft.userType) || (step === 1 && draft.readingPath) || (step === 2 && draft.pace)) ? COLORS.gold : COLORS.border,
              color: ((step === 0 && draft.userType) || (step === 1 && draft.readingPath) || (step === 2 && draft.pace)) ? COLORS.navyDeep : COLORS.muted,
              border: "none",
              borderRadius: 8,
              fontFamily: "Georgia, serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "0.2s",
            }}
          >
            {step < 2 ? "Continue" : "Begin"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step0({ draft, setDraft }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 1 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>Who are you?</h1>
      <p style={{ margin: "0 0 32px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>Your role shapes how scripture is framed. The principles are the same. The lens shifts.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {USER_TYPES.map((u) => {
          const sel = draft.userType === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setDraft({ ...draft, userType: u.id })}
              style={{
                padding: "16px 18px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
                transition: "0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 3 }}>{u.label}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic" }}>{u.desc}</div>
                </div>
                {sel && <Check size={18} color={COLORS.gold} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step1({ draft, setDraft }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 2 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>How do you want to read?</h1>
      <p style={{ margin: "0 0 28px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>Each path is a different way of moving through scripture. Pick the one that fits how you think.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {READING_PATHS.map((p) => {
          const sel = draft.readingPath === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setDraft({ ...draft, readingPath: p.id })}
              style={{
                padding: "18px 20px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.goldSoft, fontStyle: "italic", marginBottom: 8 }}>{p.tagline}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{p.description}</div>
                </div>
                {sel && <Check size={18} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({ draft, setDraft }) {
  const path = READING_PATHS.find((p) => p.id === draft.readingPath);
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Step 3 of 3</div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.5 }}>What is your pace?</h1>
      <p style={{ margin: "0 0 28px", color: COLORS.muted, fontSize: 15, lineHeight: 1.6 }}>Sustainable beats heroic. Pick what you can actually keep.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PACES.map((pc) => {
          const sel = draft.pace === pc.id;
          const est = path ? calcEstimate(path.daysApprox, pc.multiplier) : null;
          return (
            <button
              key={pc.id}
              onClick={() => setDraft({ ...draft, pace: pc.id })}
              style={{
                padding: "18px 20px",
                background: sel ? COLORS.charcoalLight : COLORS.charcoal,
                border: sel ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                color: COLORS.cream,
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: sel ? COLORS.gold : COLORS.cream, marginBottom: 4 }}>{pc.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 8 }}>{pc.desc}</div>
                  {est && (
                    <div style={{ fontSize: 11, color: COLORS.goldSoft, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>
                      Estimated finish: {est.years} years
                    </div>
                  )}
                </div>
                {sel && <Check size={18} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */

function Dashboard({ state, persist, setScreen, setActiveEntryId, user }) {
  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const entries = getEntriesForPath(state.readingPath);
  const completedCount = state.completedDays.length;
  const totalDays = path ? Math.round(path.daysApprox * (pace ? pace.multiplier : 1)) : 365;
  const pct = Math.round((completedCount / totalDays) * 100);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, " + COLORS.charcoal + ", " + COLORS.navyDeep + ")", padding: "24px 20px 28px", borderBottom: "1px solid " + COLORS.borderSoft }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 4 }}>The Builder's Bible</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.3 }}>Today</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: COLORS.charcoalLight, borderRadius: 999, border: "1px solid " + COLORS.border }}>
            <Flame size={14} color={COLORS.gold} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.gold }}>{state.streak}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 0" }}>
        {/* Plan Overview */}
        <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>Your Plan</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.cream, marginBottom: 2 }}>{path ? path.name : "--"}</div>
          <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", marginBottom: 14 }}>{pace ? pace.name : "--"}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>Progress</span>
            <span style={{ fontSize: 11, color: COLORS.goldSoft, letterSpacing: 1, fontFamily: "Helvetica, sans-serif" }}>{completedCount} / {totalDays} &middot; {pct}%</span>
          </div>
          <div style={{ background: COLORS.navyDeep, height: 4, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(90deg, " + COLORS.goldDim + ", " + COLORS.gold + ")", width: pct + "%", height: "100%", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Today's Entries */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 10 }}>Available Entries</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entries.map((e) => {
            const done = state.completedDays.includes(e.id);
            const bookmarked = state.bookmarks.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => { setActiveEntryId(e.id); setScreen("entry"); }}
                style={{
                  background: COLORS.charcoal,
                  border: done ? "1px solid " + COLORS.goldDim : "1px solid " + COLORS.border,
                  borderRadius: 12,
                  padding: "16px 18px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: COLORS.cream,
                  fontFamily: "inherit",
                  transition: "0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, flexShrink: 0, borderRadius: 8,
                    background: done ? COLORS.gold : COLORS.charcoalLight,
                    border: done ? "none" : "1px solid " + COLORS.border,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: done ? COLORS.navyDeep : COLORS.gold, fontWeight: 700, fontSize: 14,
                    fontFamily: "Helvetica, sans-serif"
                  }}>
                    {done ? <Check size={16} /> : e.day}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {e.trackName && <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 3 }}>{e.trackName}</div>}
                    <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.cream, marginBottom: 4, lineHeight: 1.3 }}>{e.reading}</div>
                    <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5 }}>{e.hook}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {bookmarked && <Bookmark size={14} color={COLORS.gold} fill={COLORS.gold} />}
                    <ArrowRight size={16} color={COLORS.goldSoft} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Nav */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid " + COLORS.borderSoft, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
  <NavButton icon={<NotebookPen size={16} />} label="Notes" onClick={() => setScreen("notes")} count={Object.keys(state.notes).length} />
  <NavButton icon={<Bookmark size={16} />} label="Saved" onClick={() => setScreen("bookmarks")} count={state.bookmarks.length} />
  <NavButton icon={<User size={16} />} label="Profile" onClick={() => setScreen("profile")} />
  <NavButton icon={<Settings size={16} />} label="Settings" onClick={() => setScreen("settings")} />
</div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.charcoal,
        border: "1px solid " + COLORS.border,
        borderRadius: 10,
        padding: "12px 8px",
        cursor: "pointer",
        color: COLORS.cream,
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <div style={{ color: COLORS.gold }}>{icon}</div>
      <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>
        {label}{count !== undefined && count > 0 ? " (" + count + ")" : ""}
      </div>
    </button>
  );
}

/* ============ ENTRY VIEW ============ */

function EntryView({ entryId, state, persist, setScreen, user }) {
  const allEntries = Object.values(ENTRIES).flat();
  const entry = allEntries.find((e) => e.id === entryId);
  if (!entry) return null;

  const unlocked = state.unlockedDays.includes(entry.id);
  const completed = state.completedDays.includes(entry.id);
  const bookmarked = state.bookmarks.includes(entry.id);
  const [noteText, setNoteText] = useState(state.notes[entry.id] || "");

  const unlock = async () => {
    const next = { ...state, unlockedDays: [...state.unlockedDays, entry.id] };
    persist(next, user);
    if (user?.id) await unlockDay(user.id, entry.id);
  };

  const toggleComplete = async () => {
    const today = new Date().toDateString();
    let newStreak = state.streak;
    let newCompleted;
    if (completed) {
      newCompleted = state.completedDays.filter((id) => id !== entry.id);
    } else {
      newCompleted = [...state.completedDays, entry.id];
      if (state.lastCompleted !== today) newStreak = state.streak + 1;
    }
    const next = { ...state, completedDays: newCompleted, streak: newStreak, lastCompleted: today };
    persist(next, user);
    if (user?.id) {
      await completeDay(user.id, entry.id, !completed);
      await saveStreak(user.id, newStreak, today);
    }
  };

  const toggleBookmark = async () => {
    const next = bookmarked
      ? state.bookmarks.filter((id) => id !== entry.id)
      : [...state.bookmarks, entry.id];
    const nextState = { ...state, bookmarks: next };
    persist(nextState, user);
    if (user?.id) await toggleBookmarkDB(user.id, entry.id, !bookmarked);
  };

  const saveNote = async (text) => {
    setNoteText(text);
    const next = { ...state.notes };
    if (text.trim()) next[entry.id] = text;
    else delete next[entry.id];
    persist({ ...state, notes: next }, user);
    if (user?.id) await saveNoteDB(user.id, entry.id, text);
  };
  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: COLORS.gold, fontFamily: "inherit", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <button onClick={toggleBookmark} style={{ background: "none", border: "none", color: bookmarked ? COLORS.gold : COLORS.muted, cursor: "pointer", padding: 4 }}>
          <Bookmark size={20} fill={bookmarked ? COLORS.gold : "none"} />
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Track label */}
        {entry.trackName && (
          <div style={{ fontSize: 10, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>{entry.trackName}</div>
        )}

        {/* Reading reference */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>Today's Reading</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.3, lineHeight: 1.2 }}>{entry.reading}</h1>
        </div>

        {/* Hook */}
        <div style={{ background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")", borderLeft: "3px solid " + COLORS.gold, borderRadius: "0 10px 10px 0", padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: COLORS.cream, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{entry.hook}</p>
        </div>

        {!unlocked ? (
          /* Locked state */
          <div>
            <div style={{ position: "relative", marginBottom: 20 }}>
              {/* Preview cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: 0.35, filter: "blur(2px)", pointerEvents: "none" }}>
                <PreviewCard label="Historical Context" text={entry.contextPreview} />
                <PreviewCard label="Key Principle" text={entry.principlePreview} />
                <PreviewCard label="Deep Dive" text="Locked content will appear here..." />
              </div>
              {/* Lock overlay */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ background: COLORS.charcoalLight, border: "1px solid " + COLORS.gold, borderRadius: 999, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={13} color={COLORS.gold} />
                  <span style={{ fontSize: 11, letterSpacing: 2, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>Read first</span>
                </div>
              </div>
            </div>

            <button
              onClick={unlock}
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")",
                color: COLORS.navyDeep,
                border: "none",
                borderRadius: 10,
                fontFamily: "Georgia, serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: "0 4px 20px rgba(201, 169, 97, 0.2)",
              }}
            >
              I have read it
            </button>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: COLORS.muted, textAlign: "center", fontStyle: "italic" }}>
              Open your Bible. Read the passage. Then tap to unlock the reflection.
            </p>
          </div>
        ) : (
          /* Unlocked state */
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <Section label="Historical Context" text={entry.context} />
            <Section label="Key Principle" text={entry.principle} highlight />
            <Section label="Deep Dive" text={entry.deepDive} />
            <Section label="Entrepreneur Application" text={entry.application} />

            {/* Question */}
            <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.goldDim, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Sit With This</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: COLORS.cream, fontStyle: "italic" }}>{entry.question}</p>
            </div>

            {/* Prayer */}
            <div style={{ background: "linear-gradient(135deg, " + COLORS.charcoal + ", " + COLORS.charcoalLight + ")", border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Closing Prayer</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: COLORS.cream }}>{entry.prayer}</p>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>Your Notes</div>
              <textarea
                value={noteText}
                onChange={(e) => saveNote(e.target.value)}
                placeholder="Reflections, questions, what stood out to you..."
                style={{
                  width: "100%",
                  minHeight: 100,
                  background: COLORS.charcoal,
                  border: "1px solid " + COLORS.border,
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: COLORS.cream,
                  fontFamily: "Georgia, serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Mark complete */}
            <button
              onClick={toggleComplete}
              style={{
                width: "100%",
                padding: "16px",
                background: completed ? COLORS.gold : "transparent",
                color: completed ? COLORS.navyDeep : COLORS.gold,
                border: "1px solid " + COLORS.gold,
                borderRadius: 10,
                fontFamily: "Georgia, serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {completed ? "✓ Completed" : "Mark Day Complete"}
            </button>
          </div>
        )}
      </div>
      <style>{"@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }"}</style>
    </div>
  );
}

function PreviewCard({ label, text }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6 }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: COLORS.cream }}>{text}</p>
    </div>
  );
}

function Section({ label, text, highlight }) {
  return (
    <div style={{
      background: highlight ? "linear-gradient(135deg, " + COLORS.charcoalLight + ", " + COLORS.charcoal + ")" : COLORS.charcoal,
      border: highlight ? "1px solid " + COLORS.goldDim : "1px solid " + COLORS.border,
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: highlight ? COLORS.gold : COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 8 }}>{label}</div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: COLORS.cream }}>{text}</p>
    </div>
  );
}

/* ============ NOTES VIEW ============ */

function NotesView({ state, setScreen, setActiveEntryId }) {
  const allEntries = Object.values(ENTRIES).flat();
  const noteEntries = Object.keys(state.notes).map((id) => allEntries.find((e) => e.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="My Notes" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        {noteEntries.length === 0 ? (
          <EmptyState text="No notes yet. Reflections you write inside an entry will appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {noteEntries.map((e) => (
              <button
                key={e.id}
                onClick={() => { setActiveEntryId(e.id); setScreen("entry"); }}
                style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: COLORS.cream, fontFamily: "inherit" }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>{e.reading}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{state.notes[e.id]}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ BOOKMARKS VIEW ============ */

function BookmarksView({ state, setScreen, setActiveEntryId }) {
  const allEntries = Object.values(ENTRIES).flat();
  const saved = state.bookmarks.map((id) => allEntries.find((e) => e.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="Saved" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        {saved.length === 0 ? (
          <EmptyState text="No bookmarks yet. Tap the bookmark icon inside an entry to save it." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {saved.map((e) => (
              <button
                key={e.id}
                onClick={() => { setActiveEntryId(e.id); setScreen("entry"); }}
                style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: COLORS.cream, fontFamily: "inherit" }}
              >
                {e.trackName && <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 3 }}>{e.trackName}</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.cream, marginBottom: 4 }}>{e.reading}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", lineHeight: 1.5 }}>{e.hook}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */

function ProfileView({ state, setState, user, setScreen }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || "");
  const [editRole, setEditRole] = useState(state.userType || "");
  const [saving, setSaving] = useState(false);

  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const userType = USER_TYPES.find((u) => u.id === state.userType);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "--";

  const initials = (user?.user_metadata?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

    const handleSave = async () => {
      setSaving(true);
      try {
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { full_name: editName } });
        await saveProfile(user.id, user.email, {
          userType: editRole,
          readingPath: state.readingPath,
          pace: state.pace,
        });
        setState({ ...state, userType: editRole });
        user.user_metadata.full_name = editName;
      } catch (e) {
        console.error("Error saving profile:", e);
      }
      setSaving(false);
      setEditing(false);
    };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: COLORS.gold, fontFamily: "inherit", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={18} /> Back
        </button>
        <div style={{ fontSize: 18, fontWeight: 400, color: COLORS.cream }}>Profile</div>
        <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer", padding: 4 }}>
          <Edit2 size={18} />
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 48px" }}>

        {/* Avatar and name */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 28, fontWeight: 700, color: COLORS.navyDeep,
            fontFamily: "Helvetica, sans-serif",
          }}>
            {initials}
          </div>
          {!editing ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 400, color: COLORS.cream, marginBottom: 4 }}>
                {user?.user_metadata?.full_name || "No name set"}
              </div>
              <div style={{ fontSize: 13, color: COLORS.goldSoft, fontStyle: "italic" }}>
                {userType?.label || "--"}
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, fontFamily: "Helvetica, sans-serif", letterSpacing: 1 }}>
                Member since {memberSince}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6, textAlign: "left" }}>Name</div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 8, color: COLORS.cream, fontFamily: "Georgia, serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 6, textAlign: "left" }}>Role</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {USER_TYPES.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setEditRole(u.id)}
                      style={{
                        padding: "10px 14px", borderRadius: 8, border: editRole === u.id ? "1px solid " + COLORS.gold : "1px solid " + COLORS.border,
                        background: editRole === u.id ? COLORS.charcoalLight : COLORS.charcoal,
                        color: editRole === u.id ? COLORS.gold : COLORS.cream,
                        fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer", textAlign: "left",
                      }}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ padding: "13px", background: "linear-gradient(135deg, " + COLORS.gold + ", " + COLORS.goldSoft + ")", color: COLORS.navyDeep, border: "none", borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <StatCard label="Current Streak" value={state.streak + " days"} />
          <StatCard label="Days Completed" value={state.completedDays.length} />
        </div>

        {/* Reading plan */}
        <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 12 }}>Reading Plan</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Path</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{path?.name || "--"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Pace</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{pace?.name || "--"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: COLORS.muted }}>Email</span>
              <span style={{ fontSize: 13, color: COLORS.cream }}>{user?.email}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.gold, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>{label}</div>
    </div>
  );
}

function SettingsView({ state, persist, setScreen, setOnboardingStep, user, setUser }) {
  const path = READING_PATHS.find((p) => p.id === state.readingPath);
  const pace = PACES.find((p) => p.id === state.pace);
  const userType = USER_TYPES.find((u) => u.id === state.userType);

  const reset = () => {
    if (confirm("Reset all progress and start over? This cannot be undone.")) {
      const fresh = {
        onboarded: false, userType: null, readingPath: null, pace: null,
        completedDays: [], unlockedDays: [], notes: {}, bookmarks: [],
        streak: 0, lastCompleted: null,
      };
      persist(fresh, user);
      setOnboardingStep(0);
      setScreen("onboarding");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.navyDeep, color: COLORS.cream, fontFamily: "Georgia, serif" }}>
      <TopBar title="Settings" onBack={() => setScreen("dashboard")} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 40px" }}>
        <SettingRow label="Role" value={userType ? userType.label : "--"} />
        <SettingRow label="Reading Path" value={path ? path.name : "--"} />
        <SettingRow label="Pace" value={pace ? pace.name : "--"} />
        <SettingRow label="Streak" value={state.streak + " days"} />
        <SettingRow label="Days Completed" value={state.completedDays.length} />

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>

          <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.goldSoft, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif", marginBottom: 10 }}>Account</div>
            <div style={{ fontSize: 14, color: COLORS.cream, marginBottom: 4 }}>{user?.user_metadata?.full_name || "No name set"}</div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>{user?.email}</div>
          </div>

          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              setUser(null);
              setScreen("onboarding");
            }}
            style={{
              width: "100%", padding: "14px", background: "transparent",
              color: COLORS.gold, border: "1px solid " + COLORS.gold,
              borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13,
              fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>

          <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 12 }}>
              Want to switch your reading path or pace? Reset will take you back through onboarding.
            </div>
            <button
              onClick={reset}
              style={{
                width: "100%", padding: "12px", background: "transparent",
                color: "#D88A8A", border: "1px solid #5A2A2A",
                borderRadius: 8, fontFamily: "Georgia, serif", fontSize: 13,
                fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset Progress
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div style={{ background: COLORS.charcoal, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase", fontFamily: "Helvetica, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gold }}>{value}</div>
    </div>
  );
}

/* ============ SHARED ============ */

function TopBar({ title, onBack }) {
  return (
    <div style={{ position: "sticky", top: 0, background: COLORS.navyDeep, borderBottom: "1px solid " + COLORS.borderSoft, padding: "16px 20px", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
        <ChevronLeft size={20} />
      </button>
      <div style={{ fontSize: 18, fontWeight: 400, color: COLORS.cream, letterSpacing: -0.2 }}>{title}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.muted, fontStyle: "italic", fontSize: 14, lineHeight: 1.7 }}>
      {text}
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !fullName) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } }
    });
    if (error) { setError(error.message); }
    else { setMessage('Check your email to confirm your account, then log in.'); setMode('confirm'); }
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); }
    else { onAuth(data.user); }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first.'); return; }
    setLoading(true); setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) { setError(error.message); }
    else { setMessage('Password reset email sent. Check your inbox.'); }
    setLoading(false);
  };

  const aBtn = {
    width: '100%', padding: '15px',
    background: 'linear-gradient(135deg, #C9A961, #D4B870)',
    color: '#091322', border: 'none', borderRadius: 8,
    fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
    letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
  };
  const oBtn = {
    width: '100%', padding: '15px', background: 'transparent',
    color: '#C9A961', border: '1px solid #C9A961', borderRadius: 8,
    fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
    letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
  };
  const gBtn = {
    width: '100%', padding: '10px', background: 'transparent',
    border: 'none', color: '#8B92A8', fontFamily: 'Helvetica, sans-serif',
    fontSize: 13, cursor: 'pointer', textAlign: 'center',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#091322', color: '#F5F1E8', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A961', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 8 }}>The Builder's Bible</div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400, color: '#F5F1E8', letterSpacing: -0.5 }}>
            {mode === 'welcome' && 'Welcome'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'confirm' && 'Check Your Email'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <div style={{ width: 40, height: 2, background: '#C9A961', margin: '12px auto 0' }} />
        </div>

        {mode === 'confirm' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#8B92A8', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{message}</p>
            <button onClick={() => setMode('signin')} style={aBtn}>Go to Login</button>
          </div>
        )}

        {mode === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ color: '#8B92A8', fontSize: 15, lineHeight: 1.7, textAlign: 'center', marginBottom: 8, fontStyle: 'italic' }}>Scripture built for the way you build.</p>
            <button onClick={() => setMode('signup')} style={aBtn}>Create Account</button>
            <button onClick={() => setMode('signin')} style={oBtn}>Log In</button>
          </div>
        )}

        {mode === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Full Name', fullName, setFullName, 'Patrick Rodriguez', 'text'], ['Email', email, setEmail, 'you@example.com', 'email'], ['Password', password, setPassword, 'Min. 6 characters', 'password']].map(([label, val, setter, ph, type]) => (
              <div key={label}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>{label}</div>
                <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            <button onClick={handleSignUp} disabled={loading} style={aBtn}>{loading ? 'Creating...' : 'Create Account'}</button>
            <button onClick={() => { setMode('welcome'); setError(''); }} style={gBtn}>Back</button>
          </div>
        )}

        {mode === 'signin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Email', email, setEmail, 'you@example.com', 'email'], ['Password', password, setPassword, 'Your password', 'password']].map(([label, val, setter, ph, type]) => (
              <div key={label}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>{label}</div>
                <input type={type} value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            {message && <p style={{ color: '#C9A961', fontSize: 13, textAlign: 'center' }}>{message}</p>}
            <button onClick={handleSignIn} disabled={loading} style={aBtn}>{loading ? 'Logging in...' : 'Log In'}</button>
            <button onClick={() => { setMode('forgot'); setError(''); }} style={gBtn}>Forgot password?</button>
            <button onClick={() => { setMode('welcome'); setError(''); }} style={gBtn}>Back</button>
          </div>
        )}

        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B92A8', textTransform: 'uppercase', fontFamily: 'Helvetica, sans-serif', marginBottom: 6 }}>Email</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '13px 14px', background: '#1A2238', border: '1px solid #2A3450', borderRadius: 8, color: '#F5F1E8', fontFamily: 'Georgia, serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E88A8A' }}>{error}</div>}
            {message && <p style={{ color: '#C9A961', fontSize: 13, textAlign: 'center' }}>{message}</p>}
            <button onClick={handleForgotPassword} disabled={loading} style={aBtn}>{loading ? 'Sending...' : 'Send Reset Email'}</button>
            <button onClick={() => { setMode('signin'); setError(''); setMessage(''); }} style={gBtn}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}