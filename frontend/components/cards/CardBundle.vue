<template>
    <div class="card">
      <div class="wrapper-content">
        <div class="wrapper-header" >
          <img
              src="https://drive.alkademi.id/v1/upload/announcement/1747276395412.png"
              alt="Thumbnail"
              class="w-100 h-100 object-fit-cover"
          />
          <span
              class="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center"
              style="width: 30px; height: 30px; top: 5px; right: 5px;"
          >
              <i
              class="ri-check-line bg-dark text-white rounded-pill d-flex align-items-center justify-content-center"
              style="width: 20px; height: 20px;"
              ></i>
          </span>
        </div>
        <div class="wrapper-body">
          <div :class="`d-flex flex-column gap-3 pt-2`">
            <div class="d-flex justify-content-between align-items-center">
              <div class="category-bundle">Test</div>
            </div>
            <NuxtLink to="/dashboard/courses/bundle/bundle-test"><h5 class="title-bundle cursor-pointer text-limit limit-1">Fullstack Developer</h5></NuxtLink>
            <p class="text-limit limit-4 description-bundle overflow-hidden">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat modi fugit exercitationem? Numquam officia sit eum praesentium veniam quos est distinctio alias excepturi ipsa, fugiat reiciendis tempora? Ut ex consectetur quae vel numquam inventore sapiente quasi alias? Provident nostrum, id dolore porro accusamus temporibus eveniet explicabo distinctio dignissimos praesentium harum.
            </p>
          </div>
          <div class="d-flex justify-content-between align-items-center pb-1">
            <div class="d-flex align-items-center materi-bundle">
              <i class="ri-book-open-line"></i>
              <p class="mb-0">2 Materi</p>
            </div>
            <div class="price">
              <p class="mb-0">Free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>

</script>

<style lang="scss" scoped>
.card{
  border-radius: 6px;
  height: 250px;
  border: 1px solid rgba(0,0,0,.08);
  padding: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:active{
    cursor: grabbing;
  }

  .wrapper-content{
    display: flex;
    height: 100%;
    gap: 24px;

    .wrapper-header{
      aspect-ratio: 9 / 16;
      width: calc(30% - 12px);
      border-radius: 6px;
      position: relative;
      overflow: hidden;

      @media (max-width: 992px) {
        width: auto;
      }
    }

    .wrapper-body{
      gap: 15px;
      width: calc(70% + 12px);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
  }
}

.price-content{
  display: flex;
  margin-bottom: 10px;

  p{
    font-size: 14px;
  }
  
  i{
    font-size: 25px;
  }
}

.category-bundle{
  background-color: rgb(236, 236, 236);
  width: max-content;
  color: rgb(93, 93, 93);
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
}

.title-bundle{
  font-family: var(--bs-font-heading);
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #000;
  width: 85%;
}

.materi-bundle{
  gap: 5px;

  i, p{
    font-size: 14px;
    font-weight: 600;
  }
}

.more-options{
  width: 27px;
  height: 27px;
  border: 1px solid rgb(157, 157, 157);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  i{
    font-size: 18px;
    font-weight: 600;
    color: rgb(157, 157, 157);
  }
}

.price{
  p{
    font-family: var(--bs-font-paragraph);
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #000;
  }
}

</style>