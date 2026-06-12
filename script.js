document.addEventListener('DOMContentLoaded', () => {
    // State
    let cropper = null;
    const defaultImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent 1x1

    // Elements
    const pfpUploadInput = document.getElementById('pfp-upload');
    const btnUpload = document.getElementById('btn-upload');
    const btnDownload = document.getElementById('btn-download');
    
    const cropperImage = document.getElementById('image-to-crop');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomVal = document.getElementById('zoom-val');

    const inputHandle = document.getElementById('handle');
    const inputName = document.getElementById('displayName');
    const inputBio = document.getElementById('bio');
    const inputNiche = document.getElementById('niche');

    const mockupAvatars = document.querySelectorAll('.mockup-avatar');
    const mockupHandles = document.querySelectorAll('.mockup-handle');
    const mockupNames = document.querySelectorAll('.mockup-display-name');
    const mockupBios = document.querySelectorAll('.mockup-bio');
    const mockupNiches = document.querySelectorAll('.mockup-niche');

    const tabs = document.querySelectorAll('.tab');
    const mockups = document.querySelectorAll('.mockup');
    
    const exportCanvas = document.getElementById('export-canvas');

    // Initialize Cropper on the placeholder
    initCropper(defaultImage);

    // Button Triggers Upload
    btnUpload.addEventListener('click', () => {
        pfpUploadInput.click();
    });

    // File Upload Handler
    pfpUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                initCropper(event.target.result);
                // Reset sliders
                zoomSlider.value = 1;
                updateSliderValues();
            };
            reader.readAsDataURL(file);
        }
    });

    function initCropper(imgSrc) {
        if (cropper) {
            cropper.destroy();
        }
        cropperImage.src = imgSrc;
        cropper = new Cropper(cropperImage, {
            aspectRatio: 1,
            viewMode: 0,
            dragMode: 'move',
            autoCropArea: 1,
            guides: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
            background: false,
            ready() {
                // Remove the crop box borders since we have our own circular mask
                const cropBox = document.querySelector('.cropper-crop-box');
                if (cropBox) {
                    cropBox.style.opacity = '0';
                }
                updateMockupsImage();
            },
            crop() {
                // Continuously update mockups while dragging/zooming
                updateMockupsImage();
            }
        });
    }

    // Sliders Logic
    zoomSlider.addEventListener('input', (e) => {
        if (cropper) {
            // Slider value is scale ratio (0.1 to 3)
            cropper.zoomTo(e.target.value); 
        }
        updateSliderValues();
    });



    function updateSliderValues() {
        zoomVal.textContent = Math.round(zoomSlider.value * 100) + '%';
    }

    // Live update function for Avatars
    function updateMockupsImage() {
        if (!cropper) return;
        // Don't draw if it's the 1x1 placeholder
        if (cropperImage.src === defaultImage) return;

        const canvas = cropper.getCroppedCanvas({
            width: 500,
            height: 500
        });
        
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            mockupAvatars.forEach(avatar => {
                avatar.style.backgroundImage = `url(${dataUrl})`;
            });
        }
    }

    // Text Input Sync
    const syncText = () => {
        let handleStr = inputHandle.value.trim() || '@testprofilepicture';
        if (!handleStr.startsWith('@')) handleStr = '@' + handleStr;
        
        let nameStr = inputName.value.trim() || 'Display Name';
        let bioStr = inputBio.value.trim() || 'Your Bio here...';
        let nicheStr = inputNiche.value.trim() || 'Creator';

        mockupHandles.forEach(el => el.textContent = handleStr);
        mockupNames.forEach(el => el.textContent = nameStr);
        mockupBios.forEach(el => el.textContent = bioStr);
        mockupNiches.forEach(el => el.textContent = nicheStr);
    };

    [inputHandle, inputName, inputBio, inputNiche].forEach(input => {
        input.addEventListener('input', syncText);
    });

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            // Hide all mockups
            mockups.forEach(m => m.classList.remove('active'));
            // Show targeted mockup
            const targetId = `mockup-${tab.dataset.platform}`;
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // Premium Download Logic
    const premiumModal = document.getElementById('premium-modal');
    const closeModal = document.getElementById('close-modal');
    const activationInput = document.getElementById('activation-code');
    const btnUnlock = document.getElementById('btn-unlock');
    const unlockMessage = document.getElementById('unlock-message');
    let isUnlocked = false;

    // Close modal handlers
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            premiumModal.classList.add('hidden');
        });
    }
    if (premiumModal) {
        premiumModal.addEventListener('click', (e) => {
            if (e.target === premiumModal) premiumModal.classList.add('hidden');
        });
    }

    if (btnUnlock) {
        btnUnlock.addEventListener('click', () => {
            const code = activationInput.value.trim();
            // Validates pattern 0x followed by exactly 6 numbers (e.g. 0x000001)
            if (/^0x\d{6}$/i.test(code)) {
                isUnlocked = true;
                unlockMessage.textContent = '✅ Premium unlocked successfully!';
                unlockMessage.classList.remove('hidden');
                unlockMessage.style.color = '#10b981'; // Green
                
                // Update unlock UI
                btnUnlock.textContent = 'Activated';
                btnUnlock.style.backgroundColor = 'var(--border-color)';
                btnUnlock.style.color = 'var(--text-main)';
                btnUnlock.setAttribute('disabled', 'true');
                activationInput.setAttribute('disabled', 'true');
                
                // Close modal after a short delay
                setTimeout(() => {
                    premiumModal.classList.add('hidden');
                    // Automatically trigger download if photo is ready
                    if (cropper && cropperImage.src !== defaultImage) {
                        btnDownload.click();
                    }
                }, 1000);
            } else {
                unlockMessage.textContent = '❌ Invalid code. Must be "0x" followed by 6 digits.';
                unlockMessage.classList.remove('hidden');
                unlockMessage.style.color = '#ef4444'; // Red
            }
        });
    }

    // Download Logic
    btnDownload.addEventListener('click', () => {
        if (!isUnlocked) {
            premiumModal.classList.remove('hidden');
            return;
        }
        if (!cropper || cropperImage.src === defaultImage) {
            alert('Please upload a photo first!');
            return;
        }

        const activeMockup = document.querySelector('.mockup.active');
        if (activeMockup && typeof html2canvas !== 'undefined') {
            html2canvas(activeMockup, {
                useCORS: true,
                scale: 2, // Double resolution for a crisp high-quality mockup
                backgroundColor: '#ffffff', // Always white for light mode
                onclone: (clonedDoc) => {
                    // Force the downloaded image to ALWAYS be in day/light mode
                    clonedDoc.body.classList.remove('dark-mode');
                    clonedDoc.documentElement.classList.remove('dark-mode');
                }
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'my-profile-mockup.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error('Error generating mockup snapshot:', err);
                alert('An error occurred while generating the mockup snapshot.');
            });
        } else {
            alert('Could not find active mockup to download.');
        }
    });
});
