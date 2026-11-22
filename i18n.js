// Full page and project-content language switch; original English records are retained.
(() => {
 let lang='en';try{lang=localStorage.getItem('yazhe:language')==='zh'?'zh':'en';}catch{}
 window.L=(en,zh)=>lang==='zh'?zh:en;
 const originalGroups=GROUPS.map(g=>({...g})),originalProjects=PROJECTS.map(p=>({...p}));
 const groups={'2d':'2D作品','3d':'3D动画',aigc:'AIGC影像',film:'叙事电影'};
 const zh={
  latch:{title:'门闩 / The Latch',type:'交互电影',desc:'这部交互式年代电影以20世纪30年代的江南为背景，探讨代际传承的观念、社会期待与个人自由。季云成长的家庭禁止在雨季打开东门。她与家庭教师冯文秋共读《牡丹亭》，逐渐亲近，而传统与独立之间的冲突也考验着两人的关系。当老师被迫冒雨离开时，季云出于关切克服恐惧，打开了那扇被禁止开启的门。',process:'交互与叙事：微缩江南宅院让故事成为可以亲身探索的空间。观众将两个人偶移动到指定位置，由位置传感器触发相应影像。四个叙事阶段依次呈现代代沿袭的规则、未言明的情感、信任的裂痕与自主的选择。',meta:'AIGC影像制作 · 交互电影 · 年代叙事'},
  migration:{title:'寂静洄游 / Silent Migration',type:'实验短片',desc:'一部60秒的超现实主义实验短片，关注海洋动物福利、圈养与剥削。作品将人类与海洋动物的角色对调，通过眼睛、双手、玻璃与珍珠，呈现野生捕捞、强制表演和离别带来的情感代价。碎片化叙事在自由、身份转换、囚禁与沉默之间移动。',process:'视觉发展：最初的二维概念通过光照与细节被发展为更具真实感的三维视觉语言。黑白色调传达紧张与情感压抑；雕塑般的身体、网与笼状结构，让美也成为一种束缚。',meta:'60秒 · 人与动物的角色互换 · 海洋动物福利'},
  pause:{title:'沉浸在暂停之中 / Immersion in the Pause',type:'动画短片',desc:'这部三维与AI辅助动画短片探索现代城市生活中的时间焦虑。一位上班族发现了暂停时间的装置，暂时逃离重复的日常，重新与他人、自然和日常之美建立联系。风格化的三维画面将职场压力与随后柔和安静的时刻形成对照。',process:'制作：初始视觉由即梦与可灵AI生成，经图像工具调整后，借助腾讯混元3D转化为资产。场景在Unreal Engine 5中搭建与布光，渲染关键帧引导AI视频生成。制作中比较多个输出的视觉质量、角色表现与空间连贯性，并通过补充反应镜头、剪辑、混音与调色，完成从冷色压力到暖色舒缓的转变。',meta:'时间焦虑 · UNREAL ENGINE 5 · AI辅助制作'},
  'history-titles':{title:'英国历史频道片头',type:'片头设计',desc:'为英国历史频道创作的片头序列项目。',meta:'片头序列 · 动态设计'},
  cheng:{title:'澄 / Limpid',type:'UNREAL ENGINE动画',desc:'作品以三维立体书诠释汉字中清澈宁静的水意象。水、自然与古典诗意，将一个汉字转化为空间叙事。镜头跟随一条鱼游向两本书；书页打开，花朵与山水展开，最后鱼游向远方。',process:'制作：立体书及其展开动画在Maya中建模与制作，再导入Unreal Engine 5。材质和环境在UE5中开发，并利用Water插件创建水体。镜头从跟随鱼，到第一本书和第二本书的展开，再到结尾的游离过程。',meta:'汉字诠释 · 立体书 · MAYA与UE5'},
  'the-hat':{title:'帽子 / THE HAT',type:'AIGC短片',desc:'一部使用生成式媒体创作的短片。',meta:'AIGC · 短片'},
  'officer-frank':{title:'弗兰克警官一直都在',type:'叙事电影',desc:'约翰与弗兰克在被雨水浸透的街道上，调查一个令人不安的发现。',meta:'叙事电影 · 编剧'}
 };
 function data(){GROUPS.forEach((g,i)=>Object.assign(g,originalGroups[i],lang==='zh'?{en:groups[g.id],zh:groups[g.id]}:{}));PROJECTS.forEach((p,i)=>{Object.assign(p,originalProjects[i]);p.videoLabel=originalProjects[i].videoLabel;p.processEn=originalProjects[i].processEn;if(lang==='zh'){const z=zh[p.id];Object.assign(p,{titleEn:z.title,typeEn:z.type,descEn:z.desc,processEn:z.process||'',meta:z.meta,videoLabel:'播放作品'});}});}
 const pairs=[
 ['.nav-right a[href="#map"] span','COLLECTION','作品分类'],['.nav-right a[href="#works"] span','SELECTED WORKS','精选作品'],['.nav-right a[href="#about"] span','ABOUT','关于'],['.nav-right a[href="#contact"] span','CONTACT','联系'],
 ['.hero .eyebrow','<span class="hero-mark" aria-hidden="true">✳</span> FILM · INTERACTIVE MEDIA · 2026','<span class="hero-mark" aria-hidden="true">✳</span> 电影 · 交互媒体 · 2026'],
 ['.hero-discipline>span:first-child','Moving images.<br>Human stories.','以影像叙事。<br>以情感相连。'],['.hero-edition','SELECTED PRACTICE<br>VOL. 01 / 2026','精选创作<br>第一辑 / 2026'],['.hero-copy>span:first-child','THE PRACTICE','创作实践'],
 ['.hero-copy .block-lang','I work across film and interactive media, exploring creative intention, emotional expression and ways of seeing through narrative, experimental and generative moving images.','我跨越电影与交互媒体创作，通过叙事、实验与生成式影像，探索创作意图、情感表达与观看的方式。'],
 ['.hero-links .descent-invite','EXPLORE THE COLLECTION <span aria-hidden="true">↓</span>','探索作品分类 <span aria-hidden="true">↓</span>'],['.profile-trigger','Meet the maker ↗','认识创作者 ↗'],
 ['.coin-intro .section-no','01 — FOUR FIELDS OF PRACTICE','01 — 四个创作方向'],['.coin-intro h2','Every piece finds its orbit.','每一件作品，自有轨迹。'],['.coin-intro p','Hover to turn. Use left / right to browse, or scroll to continue.','悬停翻转，左右方向键选择分类，上下滚动继续浏览。'],['.coin-footer>span','Four directions. One continuous current.','四个方向，同一股创作之流。'],['.coin-footer>a','All selected works ↓','查看全部作品 ↓'],
 ['#works .section-no','04 / SELECTED WORKS','04 / 精选作品'],['#worksHeading','Selected Works','精选作品'],['#works .section-copy','A shelf of moving images. Pull out a film, explore its story, and press play.','一架流动的影像。抽出一部作品，了解它的故事，再按下播放。'],
 ['.vhs-instruction','DRAG TO BROWSE · SELECT A SPINE · OPEN THE COVER','拖动浏览 · 选择书脊 · 点击封面查看'],['.vhs-open','Explore film <span aria-hidden="true">↗</span>','查看作品 <span aria-hidden="true">↗</span>'],
 ['.quote','Technology becomes a moving-image language, not a visual gimmick.','让技术成为影像语言，让表达回到情感。'],['.statement .block-lang','I am Yazhe Gao, a final-year Digital Media Arts undergraduate at Xi’an Jiaotong-Liverpool University. My practice brings together film, interactive narrative, 3D environments and generative media, exploring how visual choices carry emotion and how creators express and revise their intentions.','我是Yazhe Gao，西交利物浦大学数字媒体艺术专业本科毕业年级学生。我的创作融合电影、交互叙事、三维环境与生成式媒体，关注视觉选择如何承载情感，以及创作者如何表达和调整自己的意图。'],
 ['.contact h3',"LET'S CREATE<br>SOMETHING MEMORABLE.",'一起创作<br>值得记住的作品。'],['.badge-toggle','ID card','工牌'],['.badge-close','Close','关闭'],['.badge-instruction','Drag the card.<br>Release to swing.','拖动工牌，<br>松开后摇摆。'],['.badge-school','Xi’an Jiaotong-Liverpool University','西交利物浦大学'],['.badge-role','Digital Media Arts','数字媒体艺术'],['.badge-foot span:first-child','PORTFOLIO / 2026','作品集 / 2026'],['.badge-foot span:last-child','CREATOR','创作者'],['#contactEmailLabel','UNIVERSITY EMAIL','学校邮箱'],['#contactPhoneLabel','PHONE','电话'],['#close','×','×'],['#explore-ocean','Explore the ocean ↗','自由探索海洋 ↗'],['.footer span:last-child','Film & Interactive Art / 7 projects','电影与交互艺术 / 7个作品']
 ];
 const button=document.createElement('button');button.type='button';button.className='language-toggle';document.querySelector('.nav-right').append(button);
 function dom(){document.documentElement.lang=lang==='zh'?'zh-CN':'en';button.textContent=lang==='zh'?'EN':'中文';button.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换到中文');button.setAttribute('aria-pressed',String(lang==='zh'));for(const [selector,en,cn]of pairs)document.querySelectorAll(selector).forEach(el=>{el.innerHTML=lang==='zh'?cn:en;});const skills=['AI影像','视觉叙事','艺术指导','动态设计','剪辑','视觉发展'],enSkills=['AI FILM','VISUAL STORYTELLING','ART DIRECTION','MOTION DESIGN','EDITING','VISUAL DEVELOPMENT'];document.querySelectorAll('.skills span').forEach((el,i)=>el.textContent=lang==='zh'?skills[i]:enSkills[i]);window.portfolioLanguage=lang;}
 data();window.portfolioLanguage=lang;
 button.addEventListener('click',()=>{lang=lang==='en'?'zh':'en';try{localStorage.setItem('yazhe:language',lang);}catch{}data();window.portfolioLanguage=lang;window.dispatchEvent(new Event('portfolio-language'));dom();});
 document.addEventListener('DOMContentLoaded',()=>{window.dispatchEvent(new Event('portfolio-language'));dom();},{once:true});
})();
