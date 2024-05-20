<template>
  <div class="about">
    <h2 class="mb12">About PCPT Cleaner</h2>
    <p class="info">This page has been designed to clean up markdown copied from <a href="www.pcpricetracker.in/build">www.pcpricetracker.in/build</a></p>
    <p class="disclaimer">
			Disclaimer: This site is in no way associated with
			<a href="www.pcpricetracker.in">www.pcpricetracker.in</a>
			Do not report issues faced here to the owners of that site.
		</p>
    <h3 class="mb12">FAQ</h3>
    <span class="faq">

		<p class="q">Q. What is this and who is this for?</p>
		<p class="mb12">
			A. www.pcpricetracker.in is an Indian website which allows you to build PC
			config and share it with others. It allows copying Reddit markup.
			However, the markup is unweildy and doesn't show up very well on Reddit,
			especially on mobile. This website allows you to clean up the markup.
			It removes unnecessary information, shortens names, and optionally, removes the source.
		</p>
		<p class="q">Q. Why should I use this?</p>
		<p class="mb12"> A. You should use this if you want your build to be easily readable on your Reddit post.</p>
		<p class="q">Q. What do I do if I encounter an error?</p>
		<p>A. If you encounter an error, there are two possibilities.
			<ul class="mb12">
				<li>You have not pasted the full markup. To Solve, paste the full markup.</li>
				<li>Something has changed with Reddit markup and this site has not been updated. Create a github issue.</li>
			</ul>
		</p>
		<p class="q">Q. Who do I sue if I incur a loss because of this website?</p>
		<p>
			A. No one. This website is being provided free of cost with no guarantees or warranties as to its features and functionality.
			If you rely on it for any work which may lead to financial loss, you are solely responsible for such loss.
		</p>
    </span>

  </div>
</template>

<style>
.about {
  margin: 2rem 1rem;

}
.mb12 {
  margin-bottom: 12px;
}
.info {
  margin-bottom: 24px;

}

.disclaimer {
  margin-bottom: 24px;
  font-style: italic;

}
.faq {
  line-height: 1.6;
}
.q {
  border-bottom: 1px solid gray;
  font-style: italic;
}
</style>
