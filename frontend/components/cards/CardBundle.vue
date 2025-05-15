<template>
    <div class="card-custom border rounded p-3 d-flex align-items-start gap-4 w-100 h-100">
        <div class="card-header position-relative rounded overflow-hidden">
            <img
                src="https://drive.alkademi.id/v1/upload/announcement/1747276395412.png"
                alt="Thumbnail"
                class="w-100 h-100 object-fit-cover"
            />
            <span
                class="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center"
            >
                <i
                class="ri-check-line bg-dark text-white rounded-pill d-flex align-items-center justify-content-center"
                ></i>
            </span>
        </div>
        <div class="card-body flex-grow-1">
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-1 fw-bold">Fullstack Developer</h5>
                    <button class="btn btn-sm py-1 px-2 border rounded text-muted"><i class="ri-more-fill"></i></button>
                </div>
                <p class="mt-2 text-limit limit-5">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to 
                </p>
            </div>
            <div class="d-flex justify-content-between text-sm">
                <span>
                    <i class="ri-book-2-line me-1"></i>
                    <b>2 Materi</b>
                </span>
                <span class="fw-bold text-md">Free</span>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

.card-header {
    aspect-ratio: 9/16;
    width: 30%;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    @media (max-width: 992px) {
        width: calc(15% - 5px);
    }
    
    @media (max-width: 768px) {
        width: 30%;
    }

    span {
        width: 30px; 
        height: 30px; 
        top: 8px; 
        right: 8px;

        i {
            width: 20px; 
            height: 20px;
        }
    }
}

.card-body {
    gap: 15px;
    width: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

</style>