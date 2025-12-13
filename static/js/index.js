window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    bulmaCarousel.attach('.carousel', options);

    // Interactive Browsing Demo
    initBrowsingDemo();

})

function initBrowsingDemo() {
    const layer1Items = [0, 1, 2, 3, 4];
    
    // Helper function to create a tree item with RGB preview + hover modalities
    function createTreeItem(baseName, idx, isLayer2 = false) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'tree-item';
        itemDiv.id = baseName;
        const prefix = isLayer2 ? `4_${idx}` : idx;

        // Single RGB preview
        const singleWrap = document.createElement('div');
        singleWrap.className = 'preview-single';
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.borderRadius = '6px';
        const source = document.createElement('source');
        source.src = `./media/${prefix}_rgb.mp4`;
        source.type = 'video/mp4';
        video.appendChild(source);
        singleWrap.appendChild(video);
        itemDiv.appendChild(singleWrap);

        // Hover grid with all modalities
        const grid = document.createElement('div');
        grid.className = 'preview-grid';
        ['rgb', 'basecolor', 'depth', 'normal'].forEach(mod => {
            const v = document.createElement('video');
            v.autoplay = true;
            v.muted = true;
            v.loop = true;
            v.playsInline = true;
            v.style.width = '100%';
            v.style.height = 'auto';
            v.style.borderRadius = '4px';
            const s = document.createElement('source');
            s.src = `./media/${prefix}_${mod}.mp4`;
            s.type = 'video/mp4';
            v.appendChild(s);
            grid.appendChild(v);
        });
        itemDiv.appendChild(grid);
        return itemDiv;
    }
    
    // Create Layer 1 items
    const layer1Container = document.getElementById('layer1-items');
    layer1Items.forEach(idx => {
        const itemDiv = createTreeItem(`layer1-item-${idx}`, idx);
        layer1Container.appendChild(itemDiv);
    });
    
    // Create Layer 2 Variations items
    const layer2VariationsContainer = document.getElementById('layer2-variations-items');
    [0, 1, 2].forEach(idx => {
        const itemDiv = createTreeItem(`layer2-variation-${idx}`, idx, true);
        layer2VariationsContainer.appendChild(itemDiv);
    });
    
    // Create Layer 2 Steered items
    const layer2SteeredContainer = document.getElementById('layer2-steered-items');
    [3, 4].forEach(idx => {
        const itemDiv = createTreeItem(`layer2-steered-${idx}`, idx, true);
        layer2SteeredContainer.appendChild(itemDiv);
    });
    
    // Animation sequence (looping)
    const loadingSpinner = document.getElementById('loading-spinner');
    const browsingLoading = document.getElementById('browsing-loading');
    const originalFinal = document.getElementById('original-final');
    const connectionLine = document.getElementById('connection-line');
    const connectionLine2 = document.getElementById('connection-line-2');
    const layer1 = document.getElementById('tree-layer-1');
    const layer2Row = document.getElementById('tree-layer-2-row');
    const layer2Variations = document.getElementById('tree-layer-2-variations');
    const layer2Steered = document.getElementById('tree-layer-2-steered');
    const finalResult = document.getElementById('final-result');
    const finalLoading = document.getElementById('final-loading');
    const totalDuration = 24000; // longer hold before looping
    const originalSamplingTime = 6000; // shorter original sampling
    const halfTime = originalSamplingTime / 2; // 3 seconds
    const shortWait = 1200; // wait between stages after browsing finishes loading
    const midWait = halfTime / 2; // midway marker timing

    let timers = [];

    function resetState() {
        loadingSpinner.style.display = 'flex';
        browsingLoading.style.display = 'flex';
        originalFinal.style.display = 'none';
        connectionLine.style.display = 'none';
        connectionLine2.style.display = 'none';
        layer1.style.display = 'none';
        layer2Row.style.display = 'none';
        layer2Variations.style.display = 'none';
        layer2Steered.style.display = 'none';
        finalResult.style.display = 'none';
        finalLoading.style.display = 'none';
        timers.forEach(t => clearTimeout(t));
        timers = [];
        document.querySelectorAll('.tree-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        // restart videos
        document.querySelectorAll('#proposed-browsing video, #original-final').forEach(v => {
            v.currentTime = 0;
            v.play();
        });
    }

    function runSequence() {
        resetState();
        // Step 1: wait half time with browsing loading
        timers.push(setTimeout(() => {
            browsingLoading.style.display = 'none';
            layer1.style.display = 'block';
        }, halfTime));

        // Midway marker between layer1 and layer2: show arrow + selection
        timers.push(setTimeout(() => {
            connectionLine.style.display = 'block';
            const item4 = document.getElementById('layer1-item-4');
            if (item4) item4.classList.add('selected');
        }, halfTime + midWait));

        // Step 2: show variations (layer 2)
        timers.push(setTimeout(() => {
            layer2Row.style.display = 'flex';
            layer2Variations.style.display = 'block';
        }, halfTime * 2));

        // Step 3: wait a bit, then show steered
        timers.push(setTimeout(() => {
            layer2Steered.style.display = 'block';
        }, halfTime * 2 + shortWait));

        // Step 4: midway marker between layer2 and final — arrow + final selection
        timers.push(setTimeout(() => {
            connectionLine2.style.display = 'block';
            const item43 = document.getElementById('layer2-steered-3');
            if (item43) item43.classList.add('selected');
        }, halfTime * 2 + shortWait * 2));

        // Extra wait after final selection
        timers.push(setTimeout(() => {
        }, halfTime * 2 + shortWait * 3));

        // Step 5: show final video (no progress circles)
        timers.push(setTimeout(() => {
            finalResult.style.display = 'block';
        }, halfTime * 2 + shortWait * 4));

        // Finish original sampling
        timers.push(setTimeout(() => {
            loadingSpinner.style.display = 'none';
            originalFinal.style.display = 'block';
        }, originalSamplingTime));
    }

    runSequence();
    setInterval(runSequence, totalDuration);
}
